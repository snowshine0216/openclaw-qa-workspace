import BasePage from '../base/BasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class InCanvasSelector extends BasePage {
    static createByTitle(title) {
        const el = new InCanvasSelector(null, title);
        el.initial();
        return el;
    }

    static createByAriaLable(ariaLabel, index = 0) {
        const el = new InCanvasSelector(null, null, ariaLabel, index);
        el.initial();
        return el;
    }

    constructor(container = null, title = null, ariaLabel = null, index = 0) {
        super();
        this.container = container;
        this.title = title;
        this.ariaLabel = ariaLabel;
        this._locator = null;
        this.index = index;
    }

    initial() {
        let selectors = this.$$('.mstrmojo-UnitContainer.mstrmojo-FilterBox').filter((item) => item.isDisplayed());
        if (this.container) {
            this.container = typeof this.container === 'string' ? $(this.container) : this.container || $('body');
            selectors = this.container.$$('.mstrmojo-UnitContainer.mstrmojo-FilterBox').filter((item) => item.isDisplayed());
        }
        if (this.title) {
            this._locator = selectors.filter(async (elem) => {
                const elemText = await elem.$('.title-text').getText();
                return elemText === this.title;
            })[this.index];
        } else if (this.ariaLabel) {
            this._locator = selectors.filter(async (elem) => {
                const elemText = await elem.getAttribute('aria-label');
                return elemText.includes(this.ariaLabel);
            })[this.index];
        } else {
            this._locator = selectors[this.index];
        }
    }

    getElement() {
        this.initial();
        return this._locator;
    }

    getInstance() {
        this.initial();
        return this._locator;
    }

    setContainer(container) {
        this.initial();
        if (typeof container === 'string') {
            this.container = $(container);
        } else {
            this.container = container;
        }
    }

    // Element locator

    async getItem(elemName) {
        return this.getElement()
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(elemName);
            })[0];
    }

    getIncanvasSelectorByKey(key) {
        return this.$(`.mstrmojo-DocSelector.vi-DocSelector[k="${key}"]`);
    }

    async getItemWithExactName(elemName) {
        return this.getElement()
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === elemName;
            })[0];
    }

    getItemByKey(key, itemName) {
        return this.getIncanvasSelectorByKey(key)
            .$$('.item')
            .filter(async (elem) => {
                const item = await elem.getText();
                return item === itemName;
            })[0];
    }

    async getItemDeleteCapsure(elemName) {
        const item = await this.getItem(elemName);
        return item.$('.mstrmojo-SimpleObjectInputBox-del');
    }

    getTitle() {
        return this.getElement().$('.title-text');
    }

    getItems() {
        return this.getElement().$$('.item');
    }

    getSelectedItems() {
        return this.getElement().$$('.item.selected');
    }

    getDropdownText() {
        return this.getElement().$('.mstrmojo-ui-Pulldown-text.hasEditableText, .mstrmojo-ui-Pulldown-text');
    }

    getMenuButton() {
        return this.getElement().$('.hover-menu-btn');
    }

    getMandatoryWarningMessage() {
        return this.getElement().$('.mstrmojo-UnitContainer-WarningMessage');
    }

    getSearchBoxMandatoryWarningMessage() {
        return this.getElement().$('.mstrmojo-SimpleObjectInputBox-empty');
    }

    getSearchBoxMandatoryWarningBorder() {
        return this.getElement().$('.mstrmojo-SimpleObjectInputBox-container');
    }

    getMandatoryWarningBorder() {
        return this.getElement().$('.filterWarning');
    }

    getContextMenu() {
        return this.$('.mstrmojo-ListBase.mstrmojo-ui-Menu');
    }

    getContextMenuOption(option) {
        return this.getContextMenu()
            .$$('.item.mstrmojo-ui-Menu-item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(option);
            })[0];
    }

    getSearchContainer() {
        return this.getElement().$('.mstrmojo-ui-SearchBox');
    }

    getSearchbar() {
        return this.getSearchContainer().$('.mstrmojo-ui-sb-input');
    }

    getPopupDropdown() {
        return this.$$('.mstrmojo-popup-widget-hosted').filter((item) => item.isDisplayed())[0];
    }

    getDropdownWidget() {
        // using xpath, classname contains mstrmojo-ui-PopupWidget and dispaly : block
        return this.$(`//div[(contains(@class, 'mstrmojo-ui-PopupWidget') or contains(@class, 'mstrmojo-PopupList')) and contains(@style, 'display: block')]`);
    }

    // apply button in Pause mode， xpath  classname include mstrmojo-WebButton and child text include apply
    getApplyButtonInPauseMode() {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-PopupWidget') and contains(@style, 'display: block')]//div[contains(@class, 'mstrmojo-WebButton') and not(contains(@class, 'disabled'))][.//*[contains(text(), 'Apply')]]`);
    }

    getDropdownItem(item) {
        return this.getPopupDropdown()
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === item;
            })[0];
    }

    getDropdownItems() {
        return this.getPopupDropdown().$$('.item');
    }

    getDropdownBtn(text) {
        return this.getPopupDropdown()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    async getSelectedDrodownItem() {
        return this.getDropdownText().getText();
    }

    getSearchboxSearchIcon() {
        return this.getElement().$('.mstrmojo-SimpleObjectInputBox-empty');
    }

    getSearchboxInputBox() {
        return this.getElement().$('input');
    }

    getSearchSuggest() {
        return this.$$('.mstrmojo-SearchBoxSelector-suggest').filter((item) => item.isDisplayed())[0];
    }

    getSearchSuggestItems() {
        return this.getSearchSuggest().$$('.item');
    }

    getSelectedSearchSuggestItems() {
        return this.getSearchSuggest().$$('.item[data-selected="true"]');
    }

    getSearchItem(item) {
        return this.getSearchSuggestItems().filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === item;
        })[0];
    }

    getSelectedSearchboxItem() {
        return this.getElement().$$('.item');
    }

    getSliderBar() {
        return this.getElement().$$('.bk')[0];
    }

    getSliderButton(position = 'end') {
        let sliderMark;
        switch (position) {
            case 'start':
                sliderMark = 't1';
                break;
            case 'end':
                sliderMark = 't3';
                break;
            default:
                throw new Error(`Please make sure you have correct position value: start, end`);
        }
        return this.getElement().$(`.${sliderMark}`);
    }

    getSlideTooltip() {
        return this.$('.mstrmojo-Tooltip');
    }

    async getSliderText() {
        return this.getElement().$('.sl-control .mstrmojo-Label').getText();
    }

    getDateTextBox() {
        return this.getElement().$('.mstrmojo-DateTextBox-input');
    }

    getTextBoxInput() {
        return this.getElement().$('.mstrmojo-TextBox.mstrmojo-vi-sel-ValidationTextBox');
    }

    getSelectedRadioButtonItem() {
        return this.getElement().$('.item.selected').getAttribute('idx');
    }

    getSelectedRadioButtonItemText() {
        return this.getElement().$('.item.selected .text').getText();
    }

    getSliderFullLabel() {
        return this.getElement().$$('.mstrmojo-Label')[0];
    }

    getMQInput() {
        return this.getElement().$('.mstrmojo-vi-metric-qual');
    }

    getTooltip() {
        return this.$(`//div[contains(@class, 'mstrmojo-Tooltip')][contains(@style, 'display: block')]`);
    }

    getTooltips() {
        return this.$$('.mstrmojo-Tooltip');
    }

    getParameterSelectorBoxByIndex(index) {
        return this.$$('.mstrmojo-ParameterSelectorBox')[index - 1].$('.mstrmojo-Label.dropMsg');
    }

    // pause mode
    getEditButton() {
        return this.getElement().$(`.filterBoxEdit`);
    }

    // Action method
    async inputText(text) {
        await this.clear({ elem: this.getTextBoxInput() });
        return this.getTextBoxInput().setValue(text);
    }

    async selectItemByKey(key, itemName) {
        await this.click({ elem: this.getItemByKey(key, itemName) });
    }

    async selectItem(itemName) {
        const item = await this.getItem(itemName);
        await this.click({ elem: item });
    }

    async selectItems(itemNames) {
        for (const itemName of itemNames) {
            await this.selectItem(itemName);
        }
    }

    async selectItemWithExactName(itemName) {
        const item = await this.getItemWithExactName(itemName);
        await this.click({ elem: item });
    }

    async multiSelect(items) {
        await this.selectItem(items[0]);
        for (const [, item] of items.slice(1).entries()) {
            const el = await this.getItem(item);
            await this.ctrlClick({ elem: el });
            await this.waitForCurtainDisappear();
        }
    }

    async openDropdownMenu() {
        await this.click({ elem: this.getDropdownText() });
        await this.waitForElementVisible(this.getPopupDropdown());
    }

    async searchInDropdown(text) {
        await browser.keys(text);
        return this.sleep(1000); // wait for GUI static rendering
    }

    async closeDropdownMenu() {
        const el = this.getDropdownText();
        const width = await el.getSize('width');
        const offset = { x: width / 2 + 5, y: 0 };
        await this.clickWithOffset({ elem: el , offset });
        await this.waitForElementInvisible(this.getPopupDropdown());
    }

    async selectDropdownItems(items) {
        for (const item of items) {
            await this.click({ elem: this.getDropdownItem(item) });
        }
    }

    async chooseDropdownItems(items) {
        await this.openDropdownMenu();
        await this.selectDropdownItems(items);
    }

    async clickDropdownBtn(text) {
        await this.click({ elem: this.getDropdownBtn(text) });
    }

    async openDropdownAndSelect(items) {
        await this.openDropdownMenu();
        await this.selectDropdownItems(items);
        await this.clickDropdownBtn('OK');
    }

    async openContextMenu() {
        const elem = this.getElement();
        const width = await elem.getSize('width');
        const height = await elem.getSize('height');
        // hover on the top right corner to make the menu button visible
        const offset1 = { x: 0, y: -parseInt(height / 2 + 10) };
        await this.hover({ elem: this.getElement(), offset: offset1 });
        const offset = { x: parseInt(width / 2 - 10), y: -parseInt(height / 2 - 10) };
        await this.hover({ elem: this.getElement(), offset });
        await this.click({ elem: this.getMenuButton() });
        return this.waitForElementVisible(this.getContextMenu());
    }

    async selectOptionInMenu(option) {
        await this.click({ elem: this.getContextMenuOption(option) });
        await this.waitForElementInvisible(this.getContextMenu());
        await this.waitForCurtainDisappear();
    }

    async openAndSelectContextMenu(option) {
        await this.openContextMenu();
        await this.selectOptionInMenu(option);
    }

    async search(text) {
        const searchBar = await this.getSearchbar();
        await this.click({ elem: searchBar });
        await searchBar.setValue(text);
        await this.enter();
        return this.sleep(1000); // wait for GUI static rendering
    }

    async searchSearchbox(text, isPreloaded = false) {
        if (!isPreloaded) {
            await this.click({ elem: this.getSearchboxSearchIcon() });
        }
        const inputBox = await this.getSearchboxInputBox();
        await this.clear({ elem: inputBox });
        await inputBox.setValue(text);
        await this.sleep(1000);
        const els = this.$$('.mstrmojo-SearchBoxSelector-suggest');
        let len = await els.length;
        // wait for suggestion list appear
        if (len > 0) {
            await this.waitForElementVisible(this.getSearchSuggest());
        } else {
            // try 3 times to wait for suggestion list appear
            for (let i = 0; i < 3; i++) {
                await this.sleep(1000);
                const newLen = await this.$$('.mstrmojo-SearchBoxSelector-suggest').length;
                if (newLen > 0) {
                    await this.waitForElementVisible(this.getSearchSuggest());
                    break;
                }
            }
        }
        
    }

    async clearSearch() {
        const inputBox = await this.getSearchboxInputBox();
        await this.clear({ elem: inputBox });
        await this.sleep(1000);
    }

    async deleteSearchboxItems(items) {
        for (const item of items) {
            const el = await this.getItemDeleteCapsure(item);
            await this.click({ elem: el });
        }
    }

    async selectSearchBoxItem(item, isPreloaded = false) {
        await this.click({ elem: this.getSearchItem(item) });
        await this.dismissPreloadDropdown({ elem: this.getElement() });
        await this.waitForCurtainDisappear();
        await this.waitForDynamicElementLoading();
    }

    async selectSearchBoxItems(items, isDismissPreload = true) {
        for (const item of items) {
            await this.click({ elem: this.getSearchItem(item) });
        }
        if (isDismissPreload) {
            await this.dismissPreloadDropdown({ elem: this.getElement() });
        }
        await this.waitForCurtainDisappear();
    }

    async selectSearchBoxItemsForPreload({ items, isPreloaded = false, isSingleSelection = true }) {
        for (const item of items) {
            await this.click({ elem: this.getSearchItem(item) });
            // add sleep here since we'll wait for 1s to send change selector command to iserver
            await this.sleep(1000);
            await this.waitForCurtainDisappear();
        }
        if (isSingleSelection) {
            // If it is a single selection, we need to wait for the suggestion list to be closed
            await this.dismissSuggestionList();
        } else {
            // If it is a multi selection, we need to wait for the suggestion list to be closed
            await this.dismissPreloadElementList();
            await this.sleep(1000);
            if (isPreloaded) {
                // If it is a preload, we need to wait for the suggestion list still opened
                await this.waitForElementVisible(this.getSearchSuggest());
            } else {
                // If it is not a preload, we need to wait for the suggestion list to be closed
                await this.waitForElementInvisible(this.getSearchSuggest());
            }
        }
    }

    async dismissSuggestionList() {
        await this.dismissPreloadDropdown({ elem: this.getElement() });
        await this.waitForElementInvisible(this.getSearchSuggest());
        await this.waitForCurtainDisappear();
    }

    async dismissPreloadElementList() {
        const el = this.getElement().$('.mstrmojo-SimpleObjectInputBox-container');
        await this.clickByXYPositionNoWait({
            elem: el,
            x: -10,
            y: 0, // Click on the input box to close the suggestion list
        });
    }

    async dragSlider(toOffset, position = 'end') {
        await this.dragAndDrop({
            fromElem: this.getSliderButton(position),
            toElem: this.getSliderBar(),
            toOffset,
        });
        await this.waitForCurtainDisappear();
    }

    async getSliderTooltipText(position = 'end') {
        await this.hover({ elem: this.getSliderButton(position) });
        await this.waitForElementVisible(this.getSlideTooltip());
        return this.getSlideTooltip().getText();
    }

    async clickApplyButtonInPauseMode() {
        await this.click({ elem: this.getApplyButtonInPauseMode() });
        await this.waitForCurtainDisappear();
    }

    // Assertion helper

    async isOptionInMenu(option) {
        return this.getContextMenuOption(option).isVisible();
    }

    async isItemSelected(item) {
        const el = await this.getItem(item);
        return this.isSelected(el);
    }

    async getSelectedItemsCount() {
        const items = await this.getItems();
        let count = 0;
        for (const item of items) {
            if (await this.isSelected(item)) {
                count++;
            }
        }
        return count;
    }

    async isLinkItemSelected(item) {
        const el = await this.getItem(item);
        const name = await getAttributeValue(el, 'ariaSelected');
        return name === 'true';
    }

    async dateAndTimeText() {
        return (await this.getDateTextBox()).getAttribute('value');
    }

    async textBoxInputText() {
        const el = await this.getTextBoxInput();
        return getAttributeValue(el, 'value');
    }

    async selectedSearchItemCount() {
        return this.getSelectedSearchboxItem().length;
    }

    async getMandatoryWarningMessageText() {
        return this.getMandatoryWarningMessage().getText();
    }

    async isMandatoryWarningDisplayed() {
        return this.getMandatoryWarningMessage().isDisplayed();
    }

    async getSelectedItemsText(isSearchBox = false) {
        let selectedItems = this.getSelectedItems();
        if (isSearchBox) {
            selectedItems = this.getItems();
        }
        const count = await selectedItems.length;
        if (count === 0) {
            return [];
        }
        const value = await selectedItems.map((item) => item.getText());
        return value;
    }

    async getItemsText() {
        const items = this.getItems();
        const count = await items.length;
        if (count === 0) {
            return [];
        }
        const value = await items.map((item) => item.getText());
        return value;
    }

    async getItemsNumber() {
        return this.getItems().length;
    }

    async getSliderSelectedText() {
        return this.getSliderFullLabel().getText();
    }

    async getDropdownSelectedText() {
        return this.getElement().$('.mstrmojo-ui-Pulldown-text').getText();
    }

    async getSearchBoxMandatoryWarningMessageText() {
        const value = await this.getSearchBoxMandatoryWarningMessage().getText();
        return value;
    }

    async isSearchBoxMandatoryWarningDisplayed() {
        return this.getSearchBoxMandatoryWarningMessage().isDisplayed();
    }

    async getDropdownItemsCount() {
        return this.getDropdownItems().length;
    }

    async getAriaLabel() {
        return this.getElement().getAttribute('aria-label');
    }

    async getICSTargetTooltipText(isValueParameter = false) {
        await scrollIntoView(this.getElement());
        if (!isValueParameter) {
            await this.hover({ elem: this.getElement() });
            await this.waitForElementInvisible(this.getTooltip());
        }
        await this.hoverForICSTooltip({ elem: this.getElement() });
        await this.waitForElementVisible(this.getTooltip());
        const value = await this.getTooltip().getText();
        return value;
    }

    async getICSTitleTooltipText() {
        await this.hover({ elem: this.getElement() });
        await this.waitForElementInvisible(this.getTooltip());
        await this.hover({ elem: this.getTitle() });
        await this.waitForElementVisible(this.getTooltip());
        const value = await this.getTooltip().getText();
        return value;
    }

    async isICSTargetTooltipDisplayed() {
        await this.hover({ elem: this.getElement() });
        await this.waitForElementInvisible(this.getTooltip());
        await this.hoverForICSTooltip({ elem: this.getElement() });
        return this.getTooltip().isDisplayed();
    }

    async isICSTitleTooltipDisplayed() {
        await this.hover({ elem: this.getElement() });
        await this.waitForElementInvisible(this.getTooltip());
        await this.hover({ elem: this.getTitle() });
        return this.getTooltip().isDisplayed();
    }

    async getSelectedSearchSuggestItemsText() {
        await this.waitForElementVisible(this.getSearchSuggest());
        const items = this.getSelectedSearchSuggestItems();
        const count = await items.length;
        if (count === 0) {
            return [];
        }
        const value = await items.map((item) => item.getText());
        return value;
    }

    async getSearchSuggestItemsText() {
        await this.waitForElementVisible(this.getSearchSuggest());
        const items = this.getSearchSuggestItems();
        const count = await items.length;
        if (count === 0) {
            return [];
        }
        const value = await items.map((item) => item.getText());
        return value;
    }

    async getSearchSuggestItemIndex(item) {
        await this.waitForElementVisible(this.getSearchSuggest());
        const el = this.getSearchItem(item);
        return el.getAttribute('idx');
    }

    async getSelectedSearchSuggestItemsIndex() {
        await this.waitForElementVisible(this.getSearchSuggest());
        const items = this.getSelectedSearchSuggestItems();
        const count = await items.length;
        if (count === 0) {
            return [];
        }
        const value = await items.map((item) => item.getAttribute('idx'));
        return value;
    }

    async getSearchSuggestItemsCount() {
        await this.waitForElementVisible(this.getSearchSuggest());
        return this.getSearchSuggestItems().length;
    }
    async clickEditButtonInPauseMode() {
        await this.click({ elem: this.getEditButton() });
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
        await this.waitForDynamicElementLoading();
    }

    async getSelectedItemsInLevelDropdown() {
        const items = this.getDropdownWidget().$$('.item.selected');
        // add the logic to filter the element text is ''
        const value = await items.map((item) => item.getText());
        return value.then ? (await value).filter(text => text.trim() !== '') : value.filter(text => text.trim() !== '');
    }
}
