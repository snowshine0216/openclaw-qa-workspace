import { Key } from 'webdriverio';

/**
 * Class with method events executed via webdriver
 */
export default class Common {
    /**
     * Page object for context menu
     */
    get contextMenu() {
        return $(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]`);
    }

    /**
     * Page object for Alert Message; Can be used to getText() of the alert message window
     */
    get alertMsg() {
        return $(`//div[@class = 'mstrmojo-Box alert-content']`);
    }

    /**
     * Page object for Alert Message; Can be used to getText() of the alert message window
     */
    get alertWindow() {
        return $(
            `//div[contains(@id,'mojoAlert')]//div[contains(@class,'mstrmojo-Editor') and contains(@class,'mstrmojo-alert modal')]`
        );
    }

    /**
     * Element that is currently editable
     */
    get editingTextField() {
        return $(`(//*[@contenteditable='true'])`); // Return the first editable element
    }

    /**
     *
     * @param {String} menuItemName item name of context menu option
     */
    getContextMenuItemRevamp(menuItemName) {
        return $(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//div[text()='${menuItemName}']`);
    }

    /**
     * Page object for button name
     * @param {String} buttonName  name of the button
     */
    getButton(buttonName) {
        return $(
            `//div[contains(@class,'mstrmojo-Button')]/div[contains(@class, 'mstrmojo-Button-text') and text()='${buttonName}']`
        );
    }

    /**
     * Page object for close button (x)
     */
    get closeButton() {
        return $(`//div[contains(@class,'mstrmojo-Editor-close')][@tooltip='Close']`);
    }

    /**
     * Page object for disabled button
     * @param {String} buttonName Name of disabled button
     */
    getDisabledButton(buttonName) {
        return $(
            `//div[contains(@class,'disabled') and contains(@class,'mstrmojo-Editor-button')]/div[contains(@class, 'mstrmojo-Button-text') and text()='${buttonName}']`
        );
    }

    /**
     * Page object for link text. Will only work with anchor tags having text element, like error popup received.
     * @param {String} linkName Name of link for details
     */
    getLink(linkName) {
        return $(`//a[text()='${linkName}']`);
    }

    /**
     * Get menu editor wondow (Secondary context)
     */
    get menuEditor() {
        return $(`//div[contains(@class, 'mstrmojo-ui-MenuEditor')]`);
    }

    /**
     * Page object for span menu editor
     * @param {String} itemName Name of secondary context menu item which is of type Span
     */
    getMenuEditorItemSpan(itemName) {
        return $(`//div[contains(@class, 'mstrmojo-ui-MenuEditor')]//span[text()='${itemName}']`);
    }

    /**
     * Page object for secondary menu for div elements
     * @param {String} itemName Name of secondary menu
     */
    getSubMenuItem(itemName) {
        return $(
            `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//child::div[text()='${itemName}']`
        );
    }

    /**
     * Page object for secondary menu for div elements
     * @param {String} itemName Name of secondary menu
     */
    getSubMenuItemSpan(itemName) {
        return $(
            `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//child::span[text()='${itemName}']`
        );
    }

    /**
     * Page object for secondary menu for div elements
     * @param {String} itemName Name of secondary menu
     */
    getSubMenuItemSpanRevamp(itemName) {
        return $(
            `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//child::span[text()='${itemName}']`
        );
    }

    /**
     * Page object for secondary menu for div element selected
     * @param {String} itemName Name of secondary menu which is selected
     */
    getSubMenuSelectedItem(itemName) {
        return $(
            `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//a[@class='item on mstrmojo-ui-Menu-item']//child::div[text()='${itemName}']`
        );
    }

    /**
     * get popup alert window
     * @return element of the whole alert window
     */
    get popupAlertWindow() {
        return $(`//div[contains(@class, 'mstrmojo-alert')]`);
    }

    /**
     * get button web element by root web element and button name
     * @param {Promise<ElementFinder>} Promise to ElementFinder.
     * @param {string} buttonName button name
     * @returns {Promise<ElementFinder>} Promise to ElementFinder.
     */
    getButton2(rootElement, buttonName) {
        // using css locator instead of xpath.
        return rootElement.element(by.cssContainingText('.mstrmojo-Button-text', buttonName));
    }

    /**
     * Page object for Item popup list item by item name
     * @param {String} itemName Name of item
     */
    getPopupListItem(itemName) {
        const scrollClass = 'mstrmojo-scrollNode';

        let path = `//div[contains(@class, 'mstrmojo-PopupList') and contains(@style, 'display: block;')]//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, '${scrollClass}')]//div[contains(@class,'item') and text()='${itemName}'][1]`;
        return $(path);
    }

    /**
     * Page object for pull down (drop down)
     * @param {String} label name of label for pull down
     */
    getPullDown(label) {
        return $(`//div[contains(@class,'mstrmojo-ui-Pulldown-text') and text()='${label}']`);
    }

    /**
     * get the button (e.g. OK, Cancel) element that is on the context menu
     * @param {String} button_name
     * @return button element from the context menu
     */
    getContextMenuButton(buttonName) {
        let path = `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//div[@class='me-buttons']//div[text()='${buttonName}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // } else if (browsers.params.environment.npmMode === 'workstation' && process.platform === 'darwin') {
        //     //To add compatibility for Dossier Transaction WS Test Framework without changing the npmMode value
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return $(path);
    }

    /**
     * get the web element for context menu item
     * @param {String} menu_item_name
     * @return
     */
    getContextMenuItem(menuItemName) {
        return $(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//*[text()='${menuItemName}']`);
    }

    getContextMenuItemByPartialText(menuItemName) {
        return $(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//*[contains(text(), '${menuItemName}')]`);
    }

    /**
     * Page object for secondary context menu
     * @param {String} option Secondary Context Menu option
     */
    getSecondaryContextMenu(secondaryOption) {
        return $(
            `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//child::*[text()='${secondaryOption}']`
        );
    }

    getCheckedSecondaryContextMenu(secondaryOption) {
        return this.getSecondaryContextMenu(secondaryOption).$(`./parent::a[contains(@class, 'on')]`);
    }

    /**
     * get button element popup alert window
     * @param {String} button_name
     * @return element of the button in the alert window
     */
    getPopupAlertWindowButton(buttonName) {
        return $(
            `//div[contains(@class, 'mstrmojo-alert')]//div[@class='mstrmojo-Editor-buttons']//div[text()='${buttonName}']`
        );
    }

    /**
     * HELPER FUNCTION for when tags are unable to be found due to nbsp;
     * Builds an xpath selector to match the given str.
     *
     * @param {string} tag HTML tag to match
     * @param {string} str Text to find
     * @param {string} [parent=''] Path's parent
     * @returns {string} xpath selector
     * @author Cornell Daly
     */
    buildStringFinder(tag, str, parent = '') {
        const parts = str.split(/\s/);
        const selectors = [
            `starts-with(text(), '${parts[0]}')`,
            ...parts.slice(1).map((part) => `contains(text(), '${part}')`),
            `string-length(text())=${str.length}`,
        ];

        return `${parent}//${tag}[${selectors.join(' and ')}]`;
    }

    /**
     * Determine if the given element contains a specific class.
     *
     * @param {HTMLElement} element
     * @param {string} cls
     * @returns {boolean}
     */
    async hasClass(element, cls) {
        const classes = await element.getAttribute('class');
        return classes.split(' ').includes(cls);
    }

    /**
     *
     * @returns Control key compatible on windows and Mac clients
     */
    get controlKey() {
        return process.platform === 'darwin' ? Key.COMMAND : Key.Ctrl;
    }
}
