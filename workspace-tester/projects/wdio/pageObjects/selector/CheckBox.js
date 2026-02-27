import BaseComponent from '../base/BaseComponent.js';
import TitleBar from '../document/TitleBar.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class CheckBox extends BaseComponent {
    constructor(container) {
        super(
            container,
            '.mstrmojo-CheckListHoriz,.mstrmojo-CheckList,.mstrmojo-ui-CheckList',
            'Button list component'
        );
    }

    getListTable() {
        return this.locator.$('.mstrmojo-ListBox-table');
    }

    getTitle() {
        const plocator = this.getElement().$('../../../..').$('.mstrmojo-portlet-titlebar');
        const el = new TitleBar(plocator);
        return el;
    }

    getChecklistItems() {
        return this.getElement().$$('.mstrmojo-CheckList-item,.mstrmojo-CheckListHoriz-item, .item');
    }

    getMDXChecklistItems() {
        return this.getElement().$$('.mstrmojo-CheckList-item,.mstrmojo-CheckListHoriz-item, .icn .item');
    }

    getAllSelectItems() {
        return this.getElement().$$('.mstrmojo-CheckList-item.selected, .mstrmojo-CheckListHoriz-item.selected, .item.selected');
    }

    getItemByText(text) {
        const newtext = this.escapeRegExp(text);
        return this.getChecklistItems().filter(async (elem) => {
            const elemText = await elem.getText();
            return this.escapeRegExp(elemText) === newtext;
        })[0];
    }

    getRAItemByText(text) {
        const newtext = this.escapeRegExp(text);
        return this.getMDXChecklistItems().filter(async (elem) => {
            const elemText = await elem.$('.text').getText();
            return this.escapeRegExp(elemText) === newtext;
        })[0];
    }

    getItemBoxByText(text) {
        return this.getItemByText(text).$('input');
    }

    getItemText(text) {
        return this.getItemByText(text).$('.text');
    }

    // RA chechkbox specific methods
    getSearchBar() {
        return this.getElement().$('.search-bar');
    }

    getLevelDropdownInSearchBar() {
        return this.getSearchBar().$('.mstrmojo-ui-Pulldown-text');
    }

    getSearchBoxInputInSearchBar() {
        return this.getSearchBar().$('.mstrmojo-SearchBox input');
    }

    getClearSearchButton() {
        return this.getSearchBar().$('.mstrmojo-SearchBox-clear');
    }

    getSearchResultList() {
        return this.getElement().$(`(//div[@class='content']//div[contains(@class, 'scroll-container')])[2]`);
    }

    getListItems(ele) {
        return ele.$$('.item');
    }

    getSearchResultListItemByText(text) {
        const newtext = this.escapeRegExp(text);
        return this.getListItems(this.getSearchResultList()).filter(async (elem) => {
            const elemText = await elem.getText();
            return this.escapeRegExp(elemText) === newtext;
        })[0];
    }

    getLevelBarButton() {
        return this.getElement().$('.level-bar .level-popup-btn');
    }

    getLevelDropDownListInSearchBar() {
        return $(`//div[contains(@class, 'mstrmojo-PopupList') and contains (@style, 'display: block')]`);
    }

    getLevelDropDownList() {
        return $(`//div[contains(@class, 'mstrmojo-ui-PopupWidget') and contains (@style, 'display: block')]`);
    }

    getLevelDropdownListItemByName(ele, name) {
        const newname = this.escapeRegExp(name);
        return this.getListItems(ele).filter(async (elem) => {
            const elemText = await elem.getText();
            return this.escapeRegExp(elemText) === newname;
        })[0];
    }

    getSingleSelectionIconOfItem(text) {
        return this.getRAItemByText(text).$('.singleIndicator');
    }

    getLevelSelectionIconOfItem(text) {
        return this.getRAItemByText(text).$('.levelIndicator');
    }

    getTriangleIconOfItem(text) {
        return this.getRAItemByText(text).$('.triangle');
    }

    getCheckboxOfItem(text) {
        return this.getRAItemByText(text).$('.checkbox');
    }

    getSelectAllButton() {
        return this.getElement().$('.all-bar .select');
    }

    getClearAllButton() {
        return this.getElement().$('.all-bar .clear');
    }

    // Action helper

    async clickItemByText(text) {
        await this.click({ elem: this.getItemBoxByText(text) });
        return this.waitDocumentToBeLoaded();
    }

    async selectItemByText(text) {
        await this.click({ elem: this.getItemByText(text) });
    }

    // specific for RA checkbox
    async selectLevelInSearchBar(levelText) {
        const el = this.getLevelDropDownListInSearchBar()
        await this.click({ elem: this.getLevelDropdownInSearchBar() });
        await this.click({ elem: this.getLevelDropdownListItemByName(el, levelText) });
    }

    async search(searchKey) {
        const searchBox = this.getSearchBoxInputInSearchBar();
        await searchBox.click();
        await searchBox.setValue(searchKey);
        await this.enter();
        // wait for search results to load
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
        return this.sleep(1000);
    }

    async clearSearch() {
        const clearBtn = this.getClearSearchButton();
        await this.click({ elem: clearBtn });
        // wait for search results to load
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }

    async selectSearchResults(results) {
        for (const result of results) {
            const el = this.getSearchResultListItemByText(result);
            await this.click({ elem: el });
            await this.waitForCurtainDisappear();
            await this.waitForElementInvisible(this.getMojoLoadingIndicator());
        }
    }


    async selectLevel(levelText) {
        const el = this.getLevelDropDownList();
        await this.click({ elem: this.getLevelBarButton() });
        await this.click({ elem: this.getLevelDropdownListItemByName(el, levelText) });
        await this.dismissLevelDropdown();
    }

    async expandItemByText(text) {
        const isExpanded = await this.isItemExpanded(text);
        if (!isExpanded) {
            const triangleIcon = this.getTriangleIconOfItem(text);
            await this.click({ elem: triangleIcon });
        }
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }

    async expandItemsByText(texts) {
        for (const text of texts) {  
            await this.expandItemByText(text);
            await this.sleep(500);
        }
    }

    async collapseItemByText(text) {
        const isExpanded = await this.isItemExpanded(text);
        if (isExpanded) {
            const triangleIcon = this.getTriangleIconOfItem(text);
            await this.click({ elem: triangleIcon });
        }
    }

    async collapseItemsByText(texts) {
        for (const text of texts) {  
            await this.collapseItemByText(text);
        }
    }

    async dismissLevelDropdown() {
        // click outside to dismiss the dropdown
        const el = this.getLevelDropDownList();
        await this.clickByXYPosition({ 
            elem: el, 
            x: 100, 
            y: 0 
        });
    }

    async singleSelectItemByText(text) {
        const el = this.getRAItemByText(text);
        await scrollIntoView(el);   
        await this.hover({ elem: el });
        const singleIcon = this.getSingleSelectionIconOfItem(text);
        await this.click({ elem: singleIcon });
    }

    async levelSelectItemByText(text, level)
    {
        const el = this.getRAItemByText(text);
        await this.hover({ elem: el });
        const levelIcon = this.getLevelSelectionIconOfItem(text);
        await this.click({ elem: levelIcon });
        const levelDropdown = this.getLevelDropDownList();
        const levelItem = this.getLevelDropdownListItemByName(levelDropdown, level);
        await this.click({ elem: levelItem });
        await this.dismissLevelDropdown();
    }

    async branchSelectItemByTexts(texts) {
        for (const text of texts) {
            const el = this.getCheckboxOfItem(text);
            await this.click({ elem: el });
            await this.sleep(500);
        }
    }

    async clickSelectAll() {
        const el = this.getSelectAllButton();
        await this.click({ elem: el });
    }

    async clickClearAll() {
        const el = this.getClearAllButton();
        await this.click({ elem: el });
    }
    /**
     * Click items by items' text
     * @param {String[]} texts items' text array
     */
    async clickItems(texts) {
        for (const text of texts) {
            await this.clickItemByText(text);
        }
    }

    // Assersion helper

    /**
     * Check given items checked
     * @param {String[]} texts item text array
     */
    async isItemsChecked(texts) {
        for (const text of texts) {
            await this.waitForElementVisible(this.getItemByText(text));
            const isSelected = await this.isSelected(this.getItemByText(text));
            if (!isSelected) {
                return false;
            }
        }
        return true;
    }

    async isItemExisted(item) {
        const el = this.getChecklistItems();
        return this.isExisted(item, el, 'text');
    }

    async getSelectedItemsText() {
        const text = await this.getAllSelectItems().map((cell) => cell.getText());
        return text;
    }


    async getItemMode(text) {
        const itemText = this.getItemText(text);
        const css = await itemText.getCSSProperty('text-decoration');
        if (css.value.includes('line-through')) {
            return 'exclude';
        }
        return 'include';
    }

    async getSelectedItemsCount() {
        return this.getAllSelectItems().length;
    }

    // RA checkbox specific assersion helper
    async isItemExpanded(text) {
        const item = this.getRAItemByText(text);
        const clsName = await getAttributeValue(item, 'className');
        return clsName.includes('expanded');
    }

    async isItemLeafNode(text) {
        const item = this.getRAItemByText(text);
        const clsName = await getAttributeValue(item, 'className');
        return !(clsName.includes('hasChildren'));
    }

    async getItemSelectedStatus(text) {
        const item = this.getRAItemByText(text);
        const clsName = await getAttributeValue(item, 'className');
        if (clsName.includes('hcsd')) {
            if (clsName.includes('fullSelected') ) {
                return 'All Selected';
            } else {
                if (clsName.includes('selected')) {
                    return 'Child + Single Selected';
                } 
                return 'Child Selected';
            }
            
        } else if (clsName.includes('hasLevelSelected')) {
            return 'Child Selected';
        } else if (clsName.includes('selected')) {
            return 'Single Selected';
        }
        
        return 'Not Selected';
    }

    async getSelectedItemsInSearchResults() {
        const selectedItems = this.getSearchResultList().$$('.item.selected .text');
        const texts = await selectedItems.map((cell) => cell.getText());
        return texts;
    }

    async getAllItemsInSearchResults() {
        const allItems = this.getSearchResultList().$$('.item .text');
        const texts = await allItems.map((cell) => cell.getText());
        return texts;
    }

    
}
