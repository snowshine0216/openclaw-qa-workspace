import BasePage from '../base/BasePage.js';
import { scrollElementToBottom, scrollIntoView } from '../../utils/scroll.js';

export default class ParameterEditor extends BasePage {
    // Element Locator
    getParameterEditor() {
        return this.$('.mstrmojo-Editor.mstrmojo-vi-ui-ParameterEditor.modal');
    }

    getNameInputBox() {
        return this.getParameterEditor().$('input#embedded-parameter-editor-name-input');
    }

    getDescriptionInputBox() {
        return this.$('#embedded-parameter-editor-desc-input');
    }

    getSelectFromBtn() {
        return this.getParameterEditor().$('.mstr-rc-icon-button');
    }

    getSelectedObjectItems() {
        return this.getParameterEditor().$$('.embedded-parameter-editor-objectItem');
    }

    getSelectedObjectItem(item) {
        return this.getSelectedObjectItems().filter(async (elem) => {
            const elemText = await elem.$('.capsule-content').getText();
            return elemText === item;
        })[0];
    }

    getSelectedObjectItemRemoveBtn(item) {
        return this.getSelectedObjectItem(item).$('..').$('.capsule-remove');
    }

    getParameterEditorBtn(text) {
        return this.getParameterEditor()
            .$$('.mstr-rc-button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getBtn(text) {
        return this.$$('.mstrmojo-Button-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getCloseBtn() {
        return this.$('.edt-title-btn.mstrmojo-Editor-close');
    }

    // object select dialog
    getObjectSelectDialog() {
        return this.$('.mstr-rc-dialog-content');
    }

    getObjectListView() {
        return this.getObjectSelectDialog().$('.ant-tree-list');
    }

    getSelectObjectTypeDropdown() {
        return this.getObjectSelectDialog().$('.dialog-header-select.embedded-parameter-editor-dialog-select-dropdown');
    }

    getSelectObjectTypeDropdownContainer() {
        return this.$('.mstr-select-container__menu');
    }

    getSelectObjectType(type) {
        return this.getSelectObjectTypeDropdownContainer()
            .$$('.ant-select-item-option-content')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText) === this.escapeRegExp(type);
            })[0];
    }

    getObjectItemCheckbox(item) {
        return this.$$('.ant-tree-treenode').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === item;
        })[0];
    }

    // search

    getSearchInput() {
        return this.getObjectSelectDialog().$('.dialog-header-search input');
    }

    getSelectBtn() {
        return this.getObjectSelectDialog().$('.dialog-footer-button-select.mstr-rc-button');
    }

    getEmptyTreeNodeInSearchResult() {
        return this.getObjectSelectDialog().$('.empty-tree-node');
    }

    getSearchLoadingIcon() {
        return this.getObjectSelectDialog().$('.loading-spinner');
    }

    // dashboard level object select dialog
    getDashboardObjectItemsInSelectDialog() {
        return this.getObjectSelectDialog().$$(
            '.ant-tree-treenode:not(.ant-tree-treenode.ant-tree-treenode-switcher-open):not(.ant-tree-treenode.ant-tree-treenode-switcher-close)'
        );
    }

    getDatasetNameInSelectDialog() {
        return this.getObjectListView().$$(
            '.ant-tree-treenode.ant-tree-treenode-switcher-open, .ant-tree-treenode.ant-tree-treenode-switcher-close'
        );
    }

    // report level object parameter
    getFolderWrap(folder) {
        return this.getObjectListView()
            .$$('.ant-tree-treenode.ant-tree-treenode-switcher-close')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText).includes(this.escapeRegExp(folder));
            })[0];
    }

    getFolderWrapNodeIcon(folder) {
        return this.getFolderWrap(folder).$('.ant-tree-switcher');
    }

    getEmptyTreeNode(folder) {
        return this.getFolderWrap(folder).$('.empty-tree-node');
    }

    getTreeNodeLoading() {
        return this.$('.mstrmojo-TreeNode-text.loading');
    }

    getTreeBrowserLoadingIcon() {
        return this.$('.mstrmojo-TreeBrowser.loading');
    }

    getItemWrap(item) {
        return this.$('.ant-tree-list')
            .$$('.ant-tree-treenode')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText) === this.escapeRegExp(item);
            })[0];
    }

    getItemWrapIcon(item) {
        return this.getItemWrap(item).$('.embedded-parameter-editor-dialog-objectItem-icon span[role="img"], svg');
    }

    getLoadingIcon() {
        return this.getObjectListView().$('.anticon-loading');
    }

    // Action helper
    async inputParameterName(name) {
        await this.waitForElementVisible(this.getParameterEditor(), {
            timeout: 5000,
            msg: 'Parameter Editor is not present',
        });
        await this.click({ elem: this.getNameInputBox() });
        await this.clear({ elem: this.getNameInputBox() });
        await this.getNameInputBox().setValue(name);
    }

    async inputParameterDescription(description) {
        await this.click({ elem: this.getDescriptionInputBox() });
        await this.clear({ elem: this.getDescriptionInputBox() });
        await this.getDescriptionInputBox().setValue(description);
    }

    async clickSelectFromBtn() {
        await this.click({ elem: this.getSelectFromBtn() });
        await this.waitForElementVisible(this.getObjectSelectDialog(), {
            timeout: 5000,
            msg: 'Select Object container is not present',
        });
        await this.waitForDynamicElementLoading();
    }

    async dragAndDropSelectedItem(itemFrom, itemTo, index = 0) {
        await this.dragAndDrop({
            fromElem: this.getSelectedObjectItem(itemFrom),
            toElem: this.getSelectedObjectItem(itemTo).$('..').$$(
                '.embedded-parameter-editor-objectlist--dragPositionIndicator'
            )[index],
        });
        await this.waitForDynamicElementLoading();
    }

    async removeSelectedItem(item) {
        await this.hover({ elem: this.getSelectedObjectItem(item) });
        await this.click({ elem: this.getSelectedObjectItemRemoveBtn(item) });
        await this.waitForDynamicElementLoading();
        await this.waitForElementInvisible(this.getSelectedObjectItem(item), {
            timeout: 5000,
            msg: `Selected item ${item} is not removed from the list`,
        });
    }

    async selectObjectType(objectType) {
        await this.waitForElementVisible(this.getObjectSelectDialog(), {
            timeout: 5000,
            msg: 'Select Object container is not present',
        });
        await this.waitForDynamicElementLoading();
        await this.click({ elem: this.getSelectObjectTypeDropdown() });
        await this.waitForDynamicElementLoading();
        await this.waitForElementVisible(this.getSelectObjectTypeDropdownContainer(), {
            timeout: 5000,
            msg: 'Object type dropdown is not present',
        });
        await this.click({ elem: this.getSelectObjectType(objectType) });
        await this.waitForDynamicElementLoading();
    }

    async searchObject(text) {
        await this.click({ elem: this.getSearchInput() });
        await this.clear({ elem: this.getSearchInput() });
        await this.getSearchInput().setValue(text);
        await this.waitForDynamicElementLoading();
        await browser.keys(['Enter']);
        await this.waitForElementInvisible(this.getSearchLoadingIcon());
        await this.sleep(3000); // Wait for search results to load
        await this.waitForDynamicElementLoading();
    }

    async clickSelectButton() {
        await this.click({ elem: this.getSelectBtn() });
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getParameterEditor(), {
            timeout: 5000,
            msg: 'Parameter Editor is not closed',
        });
    }

    async clickParameterEditorButton(btn) {
        await this.click({ elem: this.getParameterEditorBtn(btn) });
        await this.waitForCurtainDisappear();
    }

    async closeParameterEditor() {
        await this.click({ elem: this.getCloseBtn() });
        await this.waitForElementInvisible(this.getParameterEditor(), {
            timeout: 5000,
            msg: 'Parameter Editor is not closed',
        });
    }

    async moveItemIntoViewPort(item) {
        const itemElement = await this.getItemWrap(item);
        await browser.execute((element) => {
            element.scrollIntoView();
        }, itemElement);
    }

    async selectItemByText(text) {
        await this.waitForDynamicElementLoading();
        await this.moveItemIntoViewPort(text);
        await this.click({ elem: this.getItemWrap(text) });
    }

    async clearSearchInput() {
        await this.click({ elem: this.getSearchInput() });
        await this.clear({ elem: this.getSearchInput() });
    }

    async moveFolderIntoViewPort(folder) {
        const folderElement = await this.getFolderWrap(folder);
        await browser.execute((element) => {
            element.scrollIntoView();
        }, folderElement);
    }

    async moveObjectIntoViewPort(object) {
        const objectElement = await this.getObjectItem(object);
        await browser.execute((element) => {
            void element.scrollIntoView();
        }, objectElement);
    }

    async openFolder(folder) {
        await this.waitForDynamicElementLoading();
        await this.waitForElementVisible(this.getObjectListView(), {
            timeout: 5000,
            msg: 'Object List View is not present',
        });
        await this.moveFolderIntoViewPort(folder);
        await this.click({ elem: this.getFolderWrapNodeIcon(folder) });
        await this.waitForElementInvisible(this.getTreeNodeLoading());
        await this.waitForElementInvisible(this.getLoadingIcon());
    }

    async multiSelectItem({ itemFrom, itemTo }) {
        await this.waitForDynamicElementLoading();
        await this.waitForElementVisible(this.getObjectListView(), {
            timeout: 5000,
            msg: 'Object List View is not present',
        });
        await this.moveItemIntoViewPort(itemFrom);
        await this.click({ elem: this.getItemWrap(itemFrom) });
        const itemToElem = await this.getItemWrap(itemTo);
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [{ type: 'keyDown', value: '\uE008' }], // Shift
            },
        ]);
        await itemToElem.click();
        await browser.performActions([
            {
                type: 'key',
                id: 'keyboard',
                actions: [{ type: 'keyUp', value: '\uE008' }], // Shift
            },
        ]);
        await this.waitForDynamicElementLoading();
    }

    // dataset level object parameter
    async addDatasetObject({ type, folder, itemList }) {
        await this.click({ elem: this.getSelectFromBtn() });
        await this.selectObjectType(type);
        await this.waitForDynamicElementLoading();
        await this.openFolder(folder);
        for (const item of itemList) {
            await this.moveItemIntoViewPort(item);
            await this.click({ elem: this.getItemWrap(item) });
        }
        await this.click({ elem: this.getSelectBtn() });
    }

    async createReportObjectParameter({ name, description, object }) {
        await this.inputParameterName(name);
        await this.inputParameterDescription(description);
        for (const objects of object) {
            await this.addDatasetObject({ type: objects.type, folder: objects.folder, itemList: objects.item });
        }
        await this.click({ elem: this.getParameterEditorBtn('Create') });
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getParameterEditor(), {
            timeout: 5000,
            msg: 'Parameter Editor is not closed',
        });
    }

    async createDashboardObjectParameter({ name, description, objectList }) {
        await this.inputParameterName(name);
        await this.inputParameterDescription(description);
        await this.click({ elem: this.getSelectFromBtn() });
        for (const object of objectList) {
            await this.selectItemByText(object);
        }
        await this.click({ elem: this.getSelectBtn() });
        await this.click({ elem: this.getParameterEditorBtn('Create') });
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getParameterEditor(), {
            timeout: 5000,
            msg: 'Parameter Editor is not closed',
        });
    }

    // dashboard level element list
    getAttributeSelectInput() {
        return this.$('.mstr-rc-standard-select__input');
    }

    getElementListDropdown() {
        return this.$('.embedded-parameter-editor-dropdown');
    }

    getElementListDropdownItem(item) {
        return this.getElementListDropdown()
            .$$('.mstr-rc-mstr-dropdown__option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === item;
            })[0];
    }

    async selectAttribute(attribute) {
        await this.click({ elem: this.getAttributeSelectInput() });
        await this.waitForElementVisible(this.getElementListDropdown(), {
            timeout: 5000,
            msg: 'Object dropdown is not present',
        });
        await this.click({ elem: this.getElementListDropdownItem(attribute) });
    }

    async createElementListParameter(name, description, attributeName) {
        await this.inputParameterName(name);
        await this.inputParameterDescription(description);
        await this.selectAttribute(attributeName);
        await this.click({ elem: this.getParameterEditorBtn('Create') });
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getParameterEditor(), {
            timeout: 5000,
            msg: 'Parameter Editor is not closed',
        });
    }

    // Value
    getDataTypeDropdown() {
        return this.$('#embedded-parameter-editor-param-type-control');
    }

    getDataTypeDropdownContainer() {
        return this.$('.embedded-parameter-editor-dropdown');
    }

    getDataTypeDropdownItem(item) {
        return this.getDataTypeDropdownContainer()
            .$$('.mstr-rc-mstr-dropdown__option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === item;
            })[0];
    }

    async changeDataType(dataType) {
        await this.click({ elem: this.getDataTypeDropdown() });
        await this.waitForElementVisible(this.getDataTypeDropdownContainer(), {
            timeout: 5000,
            msg: 'Object dropdown is not present',
        });
        await this.click({ elem: this.getDataTypeDropdownItem(dataType) });
    }

    getAllowedValueDropdown() {
        return this.$('#embedded-parameter-editor-allowed-value-control');
    }

    getAllowedValueContainer() {
        return this.$('.embedded-parameter-editor-dropdown');
    }

    getAllowedValueDropdownItem(item) {
        return this.getAllowedValueContainer()
            .$$('.mstr-rc-mstr-dropdown__option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === item;
            })[0];
    }

    async changeAllowedValue(allowedValue) {
        await this.click({ elem: this.getAllowedValueDropdown() });
        await this.waitForElementVisible(this.getAllowedValueContainer(), {
            timeout: 5000,
            msg: 'Allowed Value dropdown is not present',
        });
        await this.click({ elem: this.getAllowedValueDropdownItem(allowedValue) });
    }

    async createValueParameter(name, description, dataType, allowedValue) {
        await this.inputParameterName(name);
        await this.inputParameterDescription(description);
        await this.changeDataType(dataType);
        await this.changeAllowedValue(allowedValue);
        await this.click({ elem: this.getParameterEditorBtn('Create') });
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getParameterEditor(), {
            timeout: 5000,
            msg: 'Parameter Editor is not closed',
        });
    }

    // assertion
    async isItemDisabled(item) {
        return this.isDisabled(this.getObjectItemCheckbox(item));
    }

    async isItemChecked(item) {
        return this.isChecked(this.getObjectItemCheckbox(item));
    }

    async itemIcon(item) {
        const className = await this.getItemWrapIcon(item).getAttribute('class');
        if (className.includes('single-icon-objects-custom-group')) {
            return 'custom group';
        }
        if (className.includes('mstr-icons-single-svg-icon')) {
            return 'attribute';
        }
        if (className.includes('single-icon-si-measures-small')) {
            return 'metric';
        }
        return className;
    }

    async availableItemCountForDashboardOP() {
        await this.waitForDynamicElementLoading();
        await this.sleep(1000); // Wait for items to load

        const items = await this.getDashboardObjectItemsInSelectDialog();
        const texts = [];
        for (const item of items) {
            const text = await item.getText();
            texts.push(text);
        }
        return Number(items.length) - 1;
    }

    async isSelectBtnEnabled() {
        return (await this.getSelectBtn()).isEnabled();
    }

    async selectedObjectItemCount() {
        return this.getSelectedObjectItems().length;
    }

    async selectedObjectItemText() {
        const items = await this.getSelectedObjectItems();
        const texts = [];
        for (const item of items) {
            const textElem = await item.$('.capsule-content');
            const text = await textElem.getText();
            texts.push(text.trim());
        }
        return texts;
    }

    async emptyTreeNodeText(folder) {
        return this.getEmptyTreeNode(folder).getText();
    }

    async emptyTreeNodeTextInSearchResult() {
        return this.getEmptyTreeNodeInSearchResult().getText();
    }
}
