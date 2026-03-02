import Common from '../authoring/Common.js';
import BasePage from '../base/BasePage.js';
import LoadingDialog from './components/LoadingDialog.js';
import { Key } from 'webdriverio';

const FilterPanelContextMenuItem = {
    ADD_FILTERS: 'Add Filters',
    ADD_VISUALIZATION_FILTER: 'Add Visualization Filter...',
    UNSET_ALL_FILTERS: 'Unset All Filters',
    CLEAR_ALL_FILTERS: 'Clear All Filters',
    AUTO_APPLY_FILTERS: 'Auto-apply Filters',
    TARGET_ALL_FILTERS_BELOW: 'Target All Filters Below',
    CLEAR_ALL_TARGETS: 'Clear All Targets',
    EXPAND_ALL: 'Expand All',
    COLLAPSE_ALL: 'Collapse All',
    HELP: 'Help',
};

//Selector context menu options, including attribute selector, metric selector
const SelectorContextMenuItem = {
    INCLUDE: 'Include',
    EXCLUDE: 'Exclude',
    SHOW_OPTION_FOR_ALL: 'Show Option for All',
    UNSET_FILTER: 'Unset Filter',
    FILTER_BY_RANK: 'Filter by Rank',
    DISPLAY_ATTRIBUTE_FORMS: 'Display Attribute Forms',
    DISPLAY_STYLE: 'Display Style',
    ALLOW_MULTIPLE_SELECTIONS: 'Allow Multiple Selections',
    SELECT_TARGETS: 'Select Targets',
    DELETE: 'Delete',
    QUALIFY_ON_VALUE: 'Qualify on Value',
    QUALITY_ON_RANK: 'Qualify on Rank',
    SHOW_TITLEBAR: 'Show Titlebar',
    HIDE_TITLEBAR: 'Hide Titlebar',
    FORMAT: 'Format',
    RENAME: 'Rename',
    SORT_ASC: 'Sort Ascending', // don't need to add By because getSelectorContextMenuItem do a contains for menu item so this handles both Sort options
    SORT_DESC: 'Sort Descending',
    CLEAR_SORT: 'Clear Sort',
    DYNAMIC_SELECTION: 'Dynamic Selection',
    SELECT_ALL: 'Select All',
    CLEAR_ALL: 'Clear All',
    RESET_TO_DYNAMIC: 'Reset to', // Reset to First N or Reset to Last N
    SYNC_OPTION: 'Apply Selections To',
    RESET_TO_DEFAULT: 'Reset to Default',
};

//Selector display styles
const SelectorDisplayStyle = {
    CHECK_BOXES: 'Check Boxes',
    SLIDER: 'Slider',
    SEARCH_BOX: 'Search Box',
    RADIO_BUTTONS: 'Radio Buttons',
    DROP_DOWN: 'Drop-down',
    QUALIFICATION: 'Qualification',
    LINK_BAR: 'Link Bar',
    BUTTON_BAR: 'Button Bar',
    LIST_BOX: 'List Box',
    CALENDAR: 'Calendar',
};

const MQOperatorOptions = {
    HIGHEST: 'Highest',
    LOWEST: 'Lowest',
    HIGHEST_PERCENTAGE: 'Highest %',
    LOWEST_PERCENTAGE: 'Lowest %',
    EQUALS: 'Equals',
    DOES_NOT_EQUAL: 'Does not equal',
    GREATER_THAN: 'Greater than',
    GREATER_THAN_OR_EQUAL_TO: 'Greater than or equal to',
    LESS_THAN: 'Less than',
    LESS_THAN_OR_EQUAL_TO: 'Less than or equal to',
    BETWEEN: 'Between',
    NOT_BETWEEN: 'Not between',
    IN: 'In',
    NOT_IN: 'Not In',
    IS_NULL: 'Is Null',
    IS_NOT_NULL: 'Is Not Null',
};

export class FilterPanel extends BasePage {
    common: Common;
    loadingDialog: LoadingDialog;

    constructor() {
        super();
        this.common = new Common();
        this.loadingDialog = new LoadingDialog();
    }
    // Element locators

    /** Returns the tab for filter panel
     */
    get filterPanelTab() {
        return this.$("//div[contains(@class, 'flt')]");
    }

    /** Returns the filter panel stack
     */
    get filterPanel() {
        return this.$("//div[contains(@class,' mstrmojo-VIFilterStack')]");
    }

    /** Returns the context menu icon for the filter panel
     */
    get filterPanelMenuIcon() {
        return this.$("//div[contains(@class, 'fp-titlebar')]/div[contains(@class,'fp-menu')]");
    }

    /** Returns the Apply botton in the filter panel when auto-apply is disabled
     */
    get applyButtonInFilterPanel() {
        return this.$(
            "//div[contains(@class,'fp-btnbar')]//div[contains(@class,'mstrmojo-Button-text') and text()='Apply']"
        );
    }

    /** Returns the context menu option for filter panel
     * @param {string} menuOptionName the context menu option under filter panel
     * @returns {Promise<ElementFinder>} context menu option
     */
    getFilterPanelContextMenuOption(menuOptionName) {
        return this.$(`//div[contains(@class,'mstrmojo-ui-Menu-item-container')]//div[text()='${menuOptionName}']`);
    }

    /** Returns the object(attributes/metrics) listed under Add Filter sub menu
     * @param {string} objectName the object(attribute or metric) name
     * @returns {Promise<ElementFinder>} the object(attribute or metric) listed under Add Filter sub menu
     */
    getAddFilterObject(objectName) {
        const path = this.common.buildStringFinder(
            'span',
            objectName,
            `//div[contains(@class,'mstrmojo-ui-MenuEditor mstrmojo-ui-MenuPopup')]//div[@class='me-content']`
        );
        //div[contains(@class, 'mstrmojo-ui-MenuPopup') and contains(@class, 'showFilters')]//div[contains(@class, 'mstrmojo-VIPanelPortlet')])
        return this.$(path);
        //`//div[contains(@class,'mstrmojo-ui-MenuEditor mstrmojo-ui-MenuPopup')]//div[@class='me-content']//span[normalize-space(text())='${objectName}']`
    }

    /** Returns the button(OK or Cancel) for Add Filter sub menu and Display Attribute Forms sub menu
     * @param {string} buttonName "OK" or "Cancel" button
     * @returns {Promise<ElementFinder>} button
     */
    getButton(buttonName) {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-MenuEditor')]//div[text()='${buttonName}']`);
    }

    getDropDownButton(buttonName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ui-PopupWidget') and contains(@style,'display: block;')]//div[contains(@class, 'mstrmojo-Button')]//div[text()='${buttonName}']`
        );
    }

    /**
     * Returns the button (Done or Cancel) when in visualization filter inline dialog mode
     */
    getVisFilterDialogButton(buttonName) {
        return this.$(
            `//div[contains(@id, 'visualizationFilterToolbar')]//div[contains(@class, 'mstrmojo-Button') and text()='${buttonName}']`
        );
    }

    /**
     * Returns the label to make selection in vis filter
     */
    getVisFilterSelectionLabel(filterName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-EditableLabel') and text()='${filterName}']/ancestor::div[contains(@class, 'mstrmojo-VIPanelPortlet')]//div[contains(@class, 'mstrmojo-summary-Label')]`
        );
    }

    /**
     * Returns the button (Done or Cancel) when selecting data points in vis filter
     */
    getVisFilterDataSelectionButton(buttonName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Box titlebar-container')]//div[contains(@class, 'mstrmojo-Button') and text()='${buttonName}']`
        );
    }

    /** Returns the button(OK or Cancel) for Select Targets sub menu
     * @param {string} buttonName "Apply" or "Cancel" button
     * @returns {Promise<ElementFinder>} button
     */
    getSelectTargetButton(buttonName) {
        return this.$(`(//div[contains(@class,'mstrmojo-Button-text') and text()='${buttonName}'])[2]`);
    }

    /** Returns the context menu icon for selector
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} context menu icon for the selector
     */
    getSelectorContextMenuIcon(selectorTitle) {
        //return element(by.xpath(`//div[contains(@class,' mstrmojo-VIFilterStack')]//div[contains(@class,'title-text')]/div[contains(text(),'${selectorTitle}')]/ancestor::div/following-sibling::div[@class='right-toolbar']//div[@class='icn']`));
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm = '${selectorTitle}']//ancestor::div[contains(@class,'VIPanelPortlet')]//div[@class='right-toolbar']//div[@class='icn']`
        );
    }

    /** Returns the context menu item for selector
     * @param {string} menuItem the menu item name of the selector
     * @returns {Promise<ElementFinder>} the menu item
     */
    getSelectorContextMenuItem(menuItem) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ListBase mstrmojo-ui-Menu')]/div[contains(@class,'mstrmojo-ui-Menu-item-container')]/a[contains(@class,'mstrmojo-ui-Menu-item') and child::div[contains(text(),'${menuItem}')]]`
        );
    }

    /** Returns the title bar of the selector
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the title bar
     */
    getSelectorTitleBar(selectorTitle) {
        //return element(by.xpath(`//div[contains(@class,'VIFilterStack')]//div[contains(text(),'${selectorTitle}')]`));
        //"//div[contains(@class,'DocSelector') and @nm = 'Item Category']//ancestor::div[contains(@class,'VIPanelPortlet')]//div[contains(text(),'Item Category')]"
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm = '${selectorTitle}']//ancestor::div[contains(@class,'VIPanelPortlet')]//div[contains(text(),'${selectorTitle}')]`
        );
    }

    getSelectorTitleBarAfterReplacingObject(selectorTitle) {
        return this.$(`//div[contains(@class,'VIPanelPortlet')]//div[contains(text(),'${selectorTitle}')]`);
    }

    getSelectorLeftToolbar(selectorTitle) {
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm = '${selectorTitle}']//ancestor::div[contains(@class,'VIPanelPortlet')]//div[contains(@class,'left-toolbar')]`
        );
    }

    getSelectorTitleWithCount(selectorTitle, elementCount) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIPanel-titlebar')]//div[contains(text(), '${selectorTitle}') and contains(text(), '${elementCount}')]`
        );
    }

    getNonExecutableSelectorByTitle(selectorTitle) {
        return this.$(
            `//div[@class='mstrmojo-VIPanel mstrmojo-VIPanelPortlet nonExecutable' and contains(@style,'display: block')]//div[text()='${selectorTitle}']`
        );
    }

    /**
     * Third div in title bar is icon
     * @param {*} selectorTitle
     */
    getSelectorDynamicSelectionIcon(selectorTitle) {
        // can also be found by having classes dynamicSelection on/off
        // dynamicSelection = visible
        // on/off = different icons
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm = '${selectorTitle}']//ancestor::div[contains(@class,'VIPanelPortlet')]//div[contains(@class, 'hasFilterIcons')]//div[3]`
        );
    }

    /**
     * The summary and when selector is collapsed
     * @param {*} selectorTitle
     */
    getSelectorFilterSummary(selectorTitle) {
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm = '${selectorTitle}']//ancestor::div[contains(@class,'VIPanelPortlet')]//div[contains(@class, 'mstrmojo-summary-Label')]//div`
        );
    }

    /** Returns the selector style
     * @param {string} displayStyle the display style of the selector
     * @returns {Promise<ElementFinder>} the display style
     */
    getSelectorDisplayStyle(displayStyle) {
        let styleName = SelectorDisplayStyle.CHECK_BOXES;
        switch (displayStyle.toLowerCase()) {
            case 'check boxes':
                styleName = SelectorDisplayStyle.CHECK_BOXES;
                break;
            case 'radio buttons':
                styleName = SelectorDisplayStyle.RADIO_BUTTONS;
                break;
            case 'search box':
                styleName = SelectorDisplayStyle.SEARCH_BOX;
                break;
            case 'slider':
                styleName = SelectorDisplayStyle.SLIDER;
                break;
            case 'drop-down':
                styleName = SelectorDisplayStyle.DROP_DOWN;
                break;
            case 'qualification':
                styleName = SelectorDisplayStyle.QUALIFICATION;
                break;
            case 'calendar':
                styleName = SelectorDisplayStyle.CALENDAR;
                break;
            case 'link bar':
                styleName = SelectorDisplayStyle.LINK_BAR;
                break;
            case 'button bar':
                styleName = SelectorDisplayStyle.BUTTON_BAR;
                break;
            case 'list box':
                styleName = SelectorDisplayStyle.LIST_BOX;
                break;
        }
        return this.$(
            `//div[contains(@class,'mstrmojo-ListBase mstrmojo-ui-Menu')]/div[contains(@class,'mstrmojo-ui-Menu-item-container')]/a/div[contains(text(),'${styleName}')]`
        );
    }

    /** Returns the display attribute form for the selector
     * @param {string} formName the display attribute form name for the selector
     * @returns {Promise<ElementFinder>} the display attribute form from the sub menu of Display Attribute Forms
     */
    getDisplayForm(formName) {
        return this.$(`//div[contains(@class,'displayForms')]//span[text()='${formName}']`);
    }

    getDisplayFormPopUpMenu() {
        return this.$(`//div[contains(@class,'displayForms')]`);
    }

    getSelectedDisplayForm(formName) {
        return this.$(
            `//div[contains(@class,'displayForms')]//span[text()='${formName}']//parent::div[contains(@class, 'selected')]`
        );
    }

    getUnCheckedDisplayForm(formName) {
        return this.$(
            `//div[contains(@class,'displayForms')]//span[text()='${formName}']//ancestor::div[not(contains(@class, 'selected'))]`
        );
    }

    /** Returns the object to create a rank selector from Filter by Rank sub menu
     * @param {string} objectName  the object name to create a rank selector
     * @returns {Promise<ElementFinder>} the object from Filter by Rank sub menu
     */
    getRankByObject(objectName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ui-MenuEditor mstrmojo-ui-MenuPopup')]//div[@class='me-content']//span[text()='${objectName}']`
        );
    }

    /** Returns the target selector from Select Targers sub menu for the source selector
     * @param {string} targetSelector  target selector name
     * @returns {Promise<ElementFinder>} the target selector from Select Targets sub menu
     */
    getTarget(targetSelector) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ui-MenuEditor mstrmojo-ui-MenuPopup')]//div[@class='me-content']//span[text()='${targetSelector}']`
        );
    }

    /** Returns the element for element list style selector, including check boxes, radio buttons...
     * @param {string} selectorTitle selector's title
     * @param {string} elementName element under this selector
     * @returns {Promise<ElementFinder>} the element from the selector's element list
     */
    getSelectorElement(selectorTitle, elementName) {
        // rollback changes, keep xpath to continue investigating its stability
        // `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']//span[text()='${elementName}']`
        const path = this.common.buildStringFinder(
            'span',
            elementName,
            `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']`
        );
        return this.$(path);
    }

    getSelectorElementAfterReplacingObject(selectorTitle, elementName) {
        const path = this.common.buildStringFinder(
            'span',
            elementName,
            `//div[contains(@class,'VIPanelPortlet')]//div[contains(text(),'${selectorTitle}')]/ancestor::div[contains(@class,'mstrmojo-VIPanelPortlet')]//div[contains(@class,'mstrmojo-VIPanel-content')]`
        );
        return this.$(path);
    }

    getSelectorCollapseStatus(selectorTitle) {
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm='${selectorTitle}']/ancestor::div[contains(@class,'mstrmojo-VIPanelPortlet')]//div[contains(@class,'mstrmojo-VITitleBar') and contains(@class,'collapsed')]`
        );
    }

    getCheckListSelectorElementByIndexAndName(selectorTitle, index, elementName) {
        const el = elementName.replace(/ /g, '\u00A0');
        // `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']//span[text()='${elementName}']`
        return this.$(
            `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'item') and @idx = '${index}']/span[@class='text' and text()='${el}']`
        );
    }

    /** Returns the element from the search result list for element list style selector, including check boxes, radio buttons...
     * @param {string} selectorTitle selector's title
     * @param {string} elementName element under this selector
     * @returns {Promise<ElementFinder>} the element from the selector's element list
     */
    getSelectorElementFromSearchResultList(selectorTitle, elementName) {
        const path = this.buildStringFinderForElementListSearch(
            'span',
            elementName,
            `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']`
        );
        return this.$(path);
    }

    getSelectorElementChecked(selectorTitle, elementName) {
        return this.getSelectorElement(selectorTitle, elementName).$(`./parent::div[contains(@class, 'selected')]`);
    }

    getSelectorElementUnchecked(selectorTitle, elementName) {
        return this.getSelectorElement(selectorTitle, elementName).$(
            `./parent::div[not(contains(@class, 'selected'))]`
        );
    }

    /** Returns the search input field for element list style selector with search, including check boxes with search, radio buttons with search
     * @param {string} selectorTitle selector's title
     * @returns {Promise<ElementFinder>} the search input field
     */
    getSearchInputBox(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']//input[contains(@class,'sb-input')]`
        );
    }

    /** Returns the "x" button in search input field for element list style selector with search, including check boxes with search, radio buttons with search
     * @param {string} selectorTitle selector's title
     * @returns {Promise<ElementFinder>} the "x" button in search input field
     */
    getSearchInputClearButton(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'mstrmojo-ui-sb-btn clear')]`
        );
    }

    /** Returns the search box selector
     * @param {string} selectorTitle selector's title
     * @returns {Promise<ElementFinder>} the search box selector
     */
    getSearchBox(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-VIPanel-content')]//div[contains(@class,'DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'SearchBoxSelector')]`
        );
    }

    /** Returns the input area for the search box selector
     * @param {string} selectorTitle selector's title
     * @returns {Promise<ElementFinder>} the input area for the search box selector
     */
    getSearchBoxInput(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-VIPanel-content')]/div[contains(@class,'DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'SimpleObjectInputBox')]/input`
        );
    }

    /** Returns the element from the returned result list for search box selector
     * @param {string} elementName the element of the selector object
     * @returns {Promise<ElementFinder>} the element from the returned result list
     */
    getSearchResultElement(elementName) {
        return this.$(`//div[contains(@class,'SearchBoxSelector-suggest')]//div[text()='${elementName}']`);
    }

    /**
     * Returns the element already selected in the Search Box
     * @param {String} elementName
     */
    getSearchBoxSelectedElement(selectorTitle, elementName) {
        return this.getSearchBox(selectorTitle).$(`//div[contains(text(), '${elementName}')]`);
    }

    getDropdownElement(elementName) {
        return this.$(`//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//*[text()='${elementName}']`);
    }

    /** Returns the element from the pulldown for the single selection dropdown selector
     * @param {string} elementName the element of the selector
     * @returns {Promise<ElementFinder>} the element from the pulldown list for single selection dropdown selector
     */
    getSingleDropdownElement(elementName) {
        return this.$(`//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//*[text()='${elementName}']`);
    }

    getSingleDropdownSearchElement(searchPattern, elementName) {
        const elementSubName = elementName.split(searchPattern);
        if (
            elementSubName.length === 0 ||
            (elementSubName.length === 1 && elementSubName[0] === '') ||
            (elementSubName.length === 2 && elementSubName[0] === '' && elementSubName[1] === '')
        ) {
            return this.$(
                `//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//span[contains(@class,'sp-highlight') and text()='${searchPattern}']`
            );
        } else {
            const name = elementSubName[0] ? elementSubName[0] : elementSubName[1];
            return this.$(
                `//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//div[text()='${name}']/span[contains(@class,'sp-highlight') and text()='${searchPattern}']`
            );
        }
    }

    /** Returns the element from the pulldown for the multiple selections dropdown selector
     * @param {string} elementName the element of the selector
     * @returns {Promise<ElementFinder>} the element from the pulldown list for multiple selections dropdown selector
     */
    getMultipleDropdownElement(elementName) {
        return this.$(`//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//span[text()='${elementName}']`);
    }

    getMultipleDropdownSearchElement(searchPattern, elementName) {
        const elementSubName = elementName.split(searchPattern);
        if (
            elementSubName.length === 0 ||
            (elementSubName.length === 1 && elementSubName[0] === '') ||
            (elementSubName.length === 2 && elementSubName[0] === '' && elementSubName[1] === '')
        ) {
            return this.$(
                `//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//span[contains(@class,'sp-highlight') and text()='${searchPattern}']`
            );
        } else {
            const name = elementSubName[0] ? elementSubName[0] : elementSubName[1];
            return this.$(
                `//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//span[text()='${name}']/span[contains(@class,'sp-highlight') and text()='${searchPattern}']`
            );
        }
    }

    /** Returns the input field for searchable dropdown selector
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the input field for the dropdown selector
     */
    getDropDownTextArea(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getDropDownNoText(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'mstrmojo-ui-Pulldown-text') and not(text())]`
        );
    }

    getDropDownText(selectorTitle, text) {
        return this.$(
            `//div[contains(@class, 'DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'mstrmojo-ui-Pulldown-text') and text()='${text}']`
        );
    }

    /** Returns the operator box for the metric qualification
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the operator box of the metric qualification
     */
    getMQOperatorBox(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`
        );
    }

    get MQOperatorPopupList() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-PopupList') and contains(@style, 'display: block')]//div[contains(@class, 'popupList')]`
        );
    }

    /** Returns the operator from the pulldown list for the metric qualification
     * @param {string} selectorTitle the title of the selector
     * @param {string} operatorName  available option for MQ selector, e.g. "Greater than","Less than", etc.
     * @returns {Promise<ElementFinder>} the operator of the MQ selector from the pulldown list
     */
    getMQOperatorOption(operatorName) {
        let operatorOption = MQOperatorOptions.HIGHEST;
        switch (operatorName.toLowerCase()) {
            case 'highest':
                operatorOption = MQOperatorOptions.HIGHEST;
                break;
            case 'lowest':
                operatorOption = MQOperatorOptions.LOWEST;
                break;
            case 'highest %':
                operatorOption = MQOperatorOptions.HIGHEST_PERCENTAGE;
                break;
            case 'lowest %':
                operatorOption = MQOperatorOptions.LOWEST_PERCENTAGE;
                break;
            case 'equals':
                operatorOption = MQOperatorOptions.EQUALS;
                break;
            case 'does not equal':
                operatorOption = MQOperatorOptions.DOES_NOT_EQUAL;
                break;
            case 'greater than':
                operatorOption = MQOperatorOptions.GREATER_THAN;
                break;
            case 'greater than or equal to':
                operatorOption = MQOperatorOptions.GREATER_THAN_OR_EQUAL_TO;
                break;
            case 'less than':
                operatorOption = MQOperatorOptions.LESS_THAN;
                break;
            case 'less than or equal to':
                operatorOption = MQOperatorOptions.LESS_THAN_OR_EQUAL_TO;
                break;
            case 'between':
                operatorOption = MQOperatorOptions.BETWEEN;
                break;
            case 'not between':
                operatorOption = MQOperatorOptions.NOT_BETWEEN;
                break;
            case 'in':
                operatorOption = MQOperatorOptions.IN;
                break;
            case 'not in':
                operatorOption = MQOperatorOptions.NOT_IN;
                break;
            case 'is null':
                operatorOption = MQOperatorOptions.IS_NULL;
                break;
            case 'is not null':
                operatorOption = MQOperatorOptions.IS_NOT_NULL;
                break;
        }
        return this.$(
            `//div[contains(@class, 'mstrmojo-PopupList') and contains(@style, 'display: block')]//div[contains(@class, 'popupList')]//div[text()='${operatorOption}']`
        );
    }

    /** Return the input field for the metric qualification
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the input box of the metric qualication
     */
    getMQInputBox(selectorTitle) {
        return this.$(
            `(//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//input[contains(@class,'TextBox') and contains(@style,'inline')])[1]`
        );
    }

    /** Return the knob of the slider selector
     * @param {string} selectorTitle the title of the selector
     * @param {string} sliderIndex "left" or "right" knob of the slider, the input for this parameter is left or right
     * @returns {Promise<ElementFinder>} the knob of the slider
     */
    getSliderKnob(selectorTitle, sliderIndex) {
        let sliderPlaceholder = '';

        switch (sliderIndex.toLowerCase()) {
            case 'left':
                sliderPlaceholder = 't1';
                break;
            case 'right':
                sliderPlaceholder = 't3';
                break;
        }
        return this.$(
            `//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//div[contains(@class,'VISlider')]//div[@class='sd']/div[contains(@class,'${sliderPlaceholder}')]`
        );
    }

    getSliderKnobAfterReplacingObject(selectorTitle, sliderIndex) {
        let sliderPlaceholder = '';

        switch (sliderIndex.toLowerCase()) {
            case 'left':
                sliderPlaceholder = 't1';
                break;
            case 'right':
                sliderPlaceholder = 't3';
                break;
        }
        return this.$(
            `//div[contains(@class,'VIPanelPortlet')]//div[contains(text(),'${selectorTitle}')]/ancestor::div[contains(@class,'mstrmojo-VIPanelPortlet')]//div[contains(@class,'mstrmojo-VIPanel-content')]//div[contains(@class,'VISlider')]//div[@class='sd']/div[contains(@class,'${sliderPlaceholder}')]`
        );
    }

    /** Return the slider of the slider selector
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the slider of the slider selector
     */
    getSlider(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//div[contains(@class,'VISlider')]`
        );
    }

    getParameterSliderKnob(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//div[contains(@class,'VISlider')]//div[@class='sd']/div[contains(@class,'t3')]`
        );
    }

    /** Return the input field for the metric slider
     * @returns {Promise<ElementFinder>} the input box of the metric slider
     */
    get sliderInputBox() {
        return this.$("//div[contains(@class,'VISlider') and contains(@style, 'display: block')]//input");
    }

    /**
     * Return the label for slider
     * @param {string} selectorTitle
     */
    getSliderLabel(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//div[contains(@class,'VISlider') and contains(@style, 'display: block')]//div[contains(@class, 'sl-control')]//div[contains(@class, 'mstrmojo-Label')]`
        );
    }

    /** Return the calendar icon
     * @param {string} selectorTitle the title of the selector
     * @param {string} calendarIndex provide the index of the calendar icon, if it's for "from" date, or "to" date. The input for this parameter is "from" or "to
     * @returns {Promise<ElementFinder>} the calendar icon
     */
    getCalendarIcon(selectorTitle, fromOrToBox) {
        return this.$(
            `//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//div[contains(@class,'${fromOrToBox}')]//div[contains(@class,'icon')]`
        );
    }

    /** Return the text box of the calendar
     * @param {string} selectorTitle the title of the selector
     * @param {string} calendarIndex provide the index of the calendar icon, if it's for "from" date, or "to" date. The input for this parameter is "from" or "to
     * @returns {Promise<ElementFinder>} the input box of the calendar
     */
    getCalendarTextBox(selectorTitle, fromOrToBox) {
        return this.$(
            `//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//div[contains(@class,'${fromOrToBox}')]//input[contains(@class,'mstrmojo-DateTextBox-input')]`
        );
    }

    get calendarPopUp() {
        return this.$(
            "//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]"
        );
    }

    /** Return the year label from the calendar
     * @returns {Promise<ElementFinder>} the year label from the calendar
     */
    get yearLabel() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]//span[contains(@class,'mstrmojo-Calendar-yearLabel')]`
        );
    }

    /** Return the month label from the calendar
     * @returns {Promise<ElementFinder>} the month label from the calendar
     */
    get monthLabel() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]//span[contains(@class,'mstrmojo-Calendar-monthLabel')]`
        );
    }

    /** Return the year from the calendar year view
     * @param {string} year
     * @returns {Promise<ElementFinder>} the year from the calendar year view
     */
    getYear(year) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]//div[contains(@class,'mstrmojo-Calendar-year') and text()='${year}']`
        );
    }

    /** Return the month from the calendar month view
     * @param {string} month
     * @returns {Promise<ElementFinder>} the month from the calendar month view
     */
    getMonth(month) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]//div[contains(@class,'mstrmojo-Calendar-month') and text()='${month}']`
        );
    }

    /** Return the day from the calendar day view
     * @param {string} day
     * @returns {Promise<ElementFinder>} the month from the calendar day view
     */
    getDay(day) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]//div[contains(@class,'mstrmojo-Calendar-day-cur') and text()='${day}']`
        );
    }

    /**
     * Returns the cell to click in Grid vis filter
     * @param {*} element Text inside grid cell
     */
    getGridElementForVisFilter(elementName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-UnitContainer')]//ancestor::div[contains(@class, 'mstrmojo-VIBox ')]//child::div[@class='mstrmojo-UnitContainer-content']//child::div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class, 'mstrmojo-XtabZone')]//td[text()='${elementName}']`
        );
    }

    getDynamicSelectionMenu() {
        return this.$(`//div[contains(@class, 'dynamicSelection') and contains(@class, 'mstrmojo-ui-MenuEditor')]`);
    }

    getDynamicSelectionStatusPulldown() {
        return this.getDynamicSelectionMenu().$(`.//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`);
    }

    /**
     * Returns input box for Quantity
     */
    getDynamicSelectionInput() {
        return this.$('.dynamicSelection.mstrmojo-ui-MenuEditor .mstrmojo-TextBox');
    }

    get disableClearCheckbox() {
        return this.$(`//div[@class='mstrmojo-vi-TwoColumnProp disableClear']//div[@role='checkbox']`);
    }

    /**
     * Returns the parent of div where it has the class to determine if it's checked or not
     * @param {*} sortType "Sort Ascending (By)", "Sort Descending (By)", "Clear Sort"
     */
    getMenuSortOption(sortType) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ListBase mstrmojo-ui-Menu')]/div[contains(@class,'mstrmojo-ui-Menu-item-container')]/a/div[contains(text(),'${sortType}')]/..`
        );
    }

    getSortingAttributeMenu() {
        return this.$(`//div[contains(@class, 'sortAttributeForm') and contains(@class, 'mstrmojo-ui-Menu')]`);
    }

    /**
     * Return the parent of text div where it has the class to determine if it's checked or not
     * @param {*} form ID, DESC, etc
     */
    getSortingAttributeForm(form) {
        return this.getSortingAttributeMenu().$(`.//div[@class='mtxt' and text()='${form}']/..`);
    }

    /**
     * Returns the parent of div where it has the class to determine if it's checked or not
     * @param {string} syncOption "This Chapter Only", "All Chapters Containing This Filter"
     */
    getMenuSyncOption(syncOption) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ListBase mstrmojo-ui-Menu')]/div[contains(@class,'mstrmojo-ui-Menu-item-container')]/a/div[contains(text(),'${syncOption}')]/..`
        );
    }

    /**
     * First div in title bar is dossier level icon
     * @param {*} selectorTitle
     */
    getDossierLevelIcon(selectorTitle) {
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm = '${selectorTitle}']//ancestor::div[contains(@class,'VIPanelPortlet')]//div[contains(@class, 'hasFilterIcons')]//div[1]`
        );
    }

    get dossierLevelTooltip() {
        // already assumed to be present
        return this.$(
            `//div[text()="Selections will apply to all chapters where this filter is used."]//ancestor::div[contains(@class, 'mstrmojo-Tooltip') and contains(@style, 'visibility: visible;')]`
        );
    }

    getFilterTitleBarTooltip() {
        return this.$(
            `//div[contains(@class,'vi-tooltip-A') and  contains(@class,'filter-portlet-titlebar') and contains(@style,'display: block;')]`
        );
    }

    getFilterNameinTooltip(selectorTitle) {
        return this.getFilterTitleBarTooltip().$(
            `.//div[contains(@class,'filter_name_tooltip') and text()='${selectorTitle}']`
        );
    }

    getDatasetSrcinTooltip(datasetSrc) {
        return this.getFilterTitleBarTooltip().$(
            `.//div[contains(@class,'filter_dataset_src_tooltip') and text()='${datasetSrc}']`
        );
    }

    getFilterSummaryinTooltip(summary) {
        return this.getFilterTitleBarTooltip().$(
            `.//div[contains(@class,'filter_summary_tooltip') and text()='${summary}']`
        );
    }

    getFilterSummaryDivinTooltip() {
        return this.getFilterTitleBarTooltip().$(`.//div[contains(@class,'filter_summary_tooltip')]`);
    }

    getFilterTooltipContent(content) {
        return this.getFilterTitleBarTooltip().$(
            `.//div[contains(@class,'mstrmojo-Tooltip-content') and contains(text(),"${content}")]`
        );
    }

    getFilterPanelScrollBar(orientation) {
        return this.$(
            `(//div[contains(@class,'VIFilterStack')]//div[@class = 'mstrmojo-scrollbar ${orientation}'])[last()]`
        );
    }

    // Action Helpers
    // Actions

    /** Switch to filter panel from editor panel or format panel. Filter panel has to be enabled for doing this manipulation
     */
    async switchToFilterPanel() {
        await this.clickOnElement(this.filterPanelTab);
    }

    /** open filter panel context menu by using the icon
     */
    async toggleFilterPanelMenu() {
        await this.hoverMouseOnElement(await this.filterPanelMenuIcon);
        await this.clickOnElement(await this.filterPanelMenuIcon);
    }

    async targetAllFiltersBelow() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(
            this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.TARGET_ALL_FILTERS_BELOW)
        );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clearAllTargets() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.CLEAR_ALL_TARGETS));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async toggleAutoApplyFilters() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.AUTO_APPLY_FILTERS));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async applyFilterChanges() {
        const el = this.applyButtonInFilterPanel;
        await el.waitForDisplayed({ timeout: 3 * 1000 });
        await this.clickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async collapseAllFilters() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.COLLAPSE_ALL));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandAllFilters() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.EXPAND_ALL));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** expand or collapse the selector by clicking on the left arrow in selector title bar
     */
    async toggleSelector(selectorTitle) {
        await this.clickOnElement(this.getSelectorLeftToolbar(selectorTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async unsetAllFilters() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.UNSET_ALL_FILTERS));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clearAllFilters() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.CLEAR_ALL_FILTERS));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Add/remove objects into/from filter panel by checking/unchecking them in Add Filters context menu
     * @param {string} objectNames mstr objects to add into filter panel, can be a single element or a list of elements separated by comma without space
     */
    async addFromAddFilters(objectNames) {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(await this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.ADD_FILTERS));

        const objects = objectNames.split(',');
        for (let i = 0; i < objects.length; i++) {
            const el = await this.getAddFilterObject(objects[i]);
            await el.waitForClickable();
            await browser.pause(1 * 1000);
            await this.clickOnElement(el);
        }

        await this.clickOnElement(await this.getButton('OK'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragDSObjectToFilterPanel(objectType, objectName, datasetName) {
        const srcel = await datasetsPanel.getObjectFromDataset(objectName, objectType, datasetName);
        await srcel.waitForDisplayed();
        const desel = await this.filterPanel;
        await desel.waitForDisplayed();
        await this.dragAndDrop({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: 0 },
        });
    }

    /*
     * Add visualization filter
     */
    async addVisualizationFilter() {
        await this.toggleFilterPanelMenu();
        await this.clickOnElement(
            this.getFilterPanelContextMenuOption(FilterPanelContextMenuItem.ADD_VISUALIZATION_FILTER)
        );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickButtonInVisFilterDialog(buttonName) {
        await this.clickOnElement(this.getVisFilterDialogButton(buttonName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async makeDataSelectionInVisFilter(filterName) {
        await this.clickOnElement(this.getVisFilterSelectionLabel(filterName));
    }

    async clickButtonInVisFilterSelection(buttonName) {
        await this.clickOnElement(this.getVisFilterDataSelectionButton(buttonName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectElementInGridVisFilter(elementName) {
        await this.clickOnElement(this.getGridElementForVisFilter(elementName));
    }

    /** open the selector context menu by using the icon for a specific selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     */
    async toggleSelectorMenu(selectorTitle) {
        const btn = await this.getSelectorContextMenuIcon(selectorTitle);
        await this.clickOnElement(btn);
    }

    async hoverMouseOnElement(el) {
        await this.hover({ elem: el });
    }

    /** Selector context Menu Button becomes unclickable at times and will crash the run
     * This method resets the context menu button so it can be clicked again
     * Have at the beginning of any methods that click the selector context menu button
     * @param {string} selectorTitle the title of the selector
     */
    async resetSelectorMenuIcon(selectorTitle) {
        const selectorTitlebar = await this.getSelectorTitleBar(selectorTitle);
        await this.hoverMouseOnElement(selectorTitlebar);
        try {
            await this.hoverMouseOnElement($(`//div[contains(@style, '99998')]`));
        } catch (err) {
            //console.log(err.message);
        }
    }

    async hoverSelectorTitleBar(selectorTitle) {
        const selectorTitlebar = await this.getSelectorTitleBar(selectorTitle);
        await this.hoverMouseOnElement(selectorTitlebar);
    }

    /** delete a selector from its context menu option
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     */
    async deleteSelector(selectorTitle) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.DELETE));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Change display style for selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} styleName filter style that available under Display Style menu, e.g. Check Boxes, Slider, Search Box...
     */
    async changeDisplayStyle(selectorTitle, styleName, isReset = true) {
        if (isReset) {
            await this.resetSelectorMenuIcon(selectorTitle);
        } else {
            await this.hoverSelectorTitleBar(selectorTitle);
        }
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.DISPLAY_STYLE));
        await this.clickOnElement(this.getSelectorDisplayStyle(styleName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Select display forms for the selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} formNames the display form names for the selector
     */
    async selectDisplayForms(selectorTitle, formNames) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.DISPLAY_ATTRIBUTE_FORMS));
        const forms = formNames.split(',');
        for (let i = 0; i < forms.length; i++) {
            await this.clickOnElement(this.getDisplayForm(forms[i]));
        }

        await this.clickOnElement(this.getButton('OK'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Open the display form menu for the given selector
     * @param {string} selectorTitle  the selector's title
     */
    async openDisplayFormsMenu(selectorTitle) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.DISPLAY_ATTRIBUTE_FORMS));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Select object to create a rank from a specific attribute selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} objectName the object to create a rank selector from the specific selector's Filter by Rank sub menu
     */
    async createRankBySelector(selectorTitle, objectName) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.FILTER_BY_RANK));
        await this.clickOnElement(this.getRankByObject(objectName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Select target selectors for the source selector
     * @param {string} sourceSelector the source selector's title
     * @param {string} targetSelectors the target selectors' titles, seperated by ","
     */
    async selectTargets(sourceSelector, targetSelectors) {
        await this.resetSelectorMenuIcon(sourceSelector);
        await this.toggleSelectorMenu(sourceSelector);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.SELECT_TARGETS));
        await this.sleep(1);

        const targets = targetSelectors.split(',');
        for (let i = 0; i < targets.length; i++) {
            await this.clickOnElement(this.getTarget(targets[i]));
        }

        await this.clickOnElement(this.getSelectTargetButton('Apply'));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Toggle "Allow Multiple Selections" option for the selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     */
    async toggleMultipleSelection(selectorTitle) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.ALLOW_MULTIPLE_SELECTIONS));
    }

    /** Unset filter for individual selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     */
    async unsetSelectorFilter(selectorTitle) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(await this.getSelectorContextMenuItem(SelectorContextMenuItem.UNSET_FILTER));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Switch between "Include" and "Exclude" for the selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} modeName Include or Exclude
     */
    async changeSelectorMode(selectorTitle, modeName) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        let selMode;
        switch (modeName.toLowerCase()) {
            case 'include':
                selMode = SelectorContextMenuItem.INCLUDE;
                break;
            case 'exclude':
                selMode = SelectorContextMenuItem.EXCLUDE;
                break;
        }
        await this.clickOnElement(this.getSelectorContextMenuItem(selMode));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Click(select or de-select) on the element for the element list style selector, including check boxes, radio buttons...
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} elementNames the elements from the element list of the selector
     */
    async checkElementList(selectorTitle, elementNames) {
        const elements = elementNames.split(',');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i].replace(/ /g, '\u00A0');
            let el = await this.getSelectorElement(selectorTitle, element);
            const present = await el.isDisplayed();
            if (!present) {
                el = await this.getSelectorElementAfterReplacingObject(selectorTitle, element);
            }
            await this.clickOnElement(el);
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    /**
     * HELPER FUNCTION for element list selector with search box when tags are unable to be found due to nbsp and other tags like <em>;
     * Builds an xpath selector to match the given str.
     *
     * @param {string} tag HTML tag to match
     * @param {string} str Text to find
     * @param {string} [parent=''] Path's parent
     * @returns {string} xpath selector
     */
    buildStringFinderForElementListSearch(tag, str, parent = '') {
        const parts = str.split(/\s+/);
        const selectors: string[] = [];

        selectors.push(`contains(text(), '${parts[0]}')`);

        for (let i = 1; i < parts.length; i++) {
            selectors.push(`contains(., '${parts[i]}')`);
        }

        return `${parent}//${tag}[${selectors.join(' and ')}]`;
    }

    /** Search and click(select or de-select) on the element for the element list style selector with search, including check boxes, radio buttons...
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern the user input used to search
     * @param {string} elementNames the elements from the returned element list for the search
     */
    async checkElementListAfterSearch(selectorTitle, searchPattern, elementNames) {
        const inputBox = await this.getSearchInputBox(selectorTitle);
        await this.clear({ elem: inputBox });
        await inputBox.setValue(searchPattern);
        const elements = elementNames.split(',');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i].replace(searchPattern, ' ' + searchPattern + ' ');
            await this.clickOnElement(await this.getSelectorElementFromSearchResultList(selectorTitle, element));
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    /** Search for the element list style selector with search, including check boxes, radio buttons...
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern the user input used to search
     */
    async searchForElement(selectorTitle, searchPattern) {
        const inputBox = this.getSearchInputBox(selectorTitle);
        await inputBox.waitForClickable();
        await this.clear({ elem: inputBox });
        await inputBox.setValue(searchPattern);
    }

    /** Clear the search pattern for the element list style selector with search by clicking on "X" button, including check boxes, radio buttons...
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     */
    async clearElementListSearchPattern(selectorTitle) {
        await this.clickOnElement(this.getSearchInputClearButton(selectorTitle));
    }

    /** Search and select the element from the returned result list for search box selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern the user input used to search
     * @param {string} elementName the elements from the returned result list for the search
     */
    async searchBox(selectorTitle, searchPattern, elementName) {
        const searchBoxInput = this.getSearchBoxInput(selectorTitle);
        const searchBox = this.getSearchBox(selectorTitle);
        await this.clickOnElement(searchBox);
        await searchBoxInput.setValue(searchPattern);

        await this.clickOnElement(this.getSearchResultElement(elementName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Search but without selecting the element from the returned result list for search box selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern the user input used to search
     */
    async searchBoxwithoutSelecting(selectorTitle, searchPattern) {
        const searchBoxInput = this.getSearchBoxInput(selectorTitle);
        const searchBox = this.getSearchBox(selectorTitle);
        await this.clickOnElement(searchBox);
        await searchBoxInput.setValue(searchPattern);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** select the element from the returned result list for search box selector once the result list is back
     * @param {string} elementName the element from the returned result list for the search
     */
    async selectElementInSearchBox(elementName) {
        await this.clickOnElement(this.getSearchResultElement(elementName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Clear the search box
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     */
    async clearSearchBox(selectorTitle) {
        const searchBoxInput = await this.getSearchBoxInput(selectorTitle);
        await this.clickOnElement(searchBoxInput);
        await this.clear({ elem: searchBoxInput });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Open the pulldown element list for dropdown selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     */
    async openDropdownPulldown(selectorTitle) {
        await this.clickOnElement(await this.getDropDownTextArea(selectorTitle));
    }

    /** Select the element from the pulldown for single dropdown selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} elementName the element of the selector
     */
    async singleDropdown(selectorTitle, elementName, reset = 1) {
        if (reset == 1) await this.resetSelectorMenuIcon(selectorTitle);
        await this.sleep(3);
        await this.openDropdownPulldown(selectorTitle);
        await this.clickOnElement(await this.getSingleDropdownElement(elementName));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Search in single dropdown selector and select the element from the result list
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern key word used to search
     * @param {string} elementName the element of the selector
     */
    async searchableSingleDropdown(selectorTitle, searchPattern, elementName) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.clickOnElement(this.getDropDownTextArea(selectorTitle));
        await this.getDropDownTextArea(selectorTitle).setValue(searchPattern);
        await this.clickOnElement(this.getSingleDropdownSearchElement(searchPattern, elementName));
    }

    /** Select the element(s) from the pulldown for single dropdown selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} elementNames the list of elements of the selector
     */
    async multipleDropdown(selectorTitle, elementNames) {
        await this.openDropdownPulldown(selectorTitle);
        const elements = elementNames.split(',');
        for (let i = 0; i < elements.length; i++) {
            await this.clickOnElement(await this.getMultipleDropdownElement(elements[i]));
        }
        await this.clickOnElement(this.getDropDownButton('OK'));
        await this.sleep(2);
    }

    /** Search in multiple dropdown selector and select the element(s) from the result list
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern key word used to search
     * @param {string} elementNames the element(s) of the selector
     */
    async searchableMultipleDropdown(selectorTitle, searchPattern, elementNames) {
        await this.resetSelectorMenuIcon(selectorTitle);
        const elements = elementNames.split(',');
        await this.clickOnElement(this.getDropDownTextArea(selectorTitle));
        await this.getDropDownTextArea(selectorTitle).setValue(searchPattern);
        for (let i = 0; i < elements.length; i++) {
            await this.clickOnElement(this.getMultipleDropdownSearchElement(searchPattern, elements[i]));
            await promiseWithTimeout(browser.pause(2000), undefined, 2000, `execution paused for 2 seconds`);
        }

        await this.clickOnElement(this.getButton('OK'));
        await promiseWithTimeout(browser.pause(2000), undefined, 2000, `execution paused for 2 seconds`);
    }

    /** for Metric Qualification style selector manipulation, on Rank or on Value.
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} operatorName  available option for MQ selector, e.g. "Greater than","Less than", etc.
     * @param {string} inputValue    Rank or Value you want to set the the metric to
     */
    async metricQualificationSelector(selectorTitle, operatorName, inputValue1 = 0, inputValue2 = 0) {
        let input_field = await this.getMQInputBox(selectorTitle);
        let operatorBoxText;
        await this.getMQOperatorBox(selectorTitle)
            .getText()
            .then(async function (text) {
                operatorBoxText = text;
            });

        //if the previous operator is "Is Null" or "Is Not Null", there's no text box to clear
        //if the new operator is "Is Null" or "Is Not Null", there's no need to clear the text box
        if (operatorBoxText !== 'Is Null' && operatorBoxText !== 'Is Not Null') {
            if (operatorName.toLowerCase() !== 'is null' && operatorName.toLowerCase() !== 'is not null') {
                await this.clear({ elem: input_field });
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            }
        } else {
            await this.clickOnElement(await this.getMQOperatorBox(selectorTitle));
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            await this.clickOnElement(await this.getMQOperatorOption(operatorName));
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }

        if (
            operatorName.toLowerCase() !== 'is null' &&
            operatorName.toLowerCase() !== 'is not null' &&
            operatorName.toLowerCase() !== 'highest %' &&
            operatorName.toLowerCase() !== 'lowest %'
        ) {
            await input_field.setValue(inputValue1 + '\n');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }

        await this.sleep(3);
        await this.clickOnElement(await this.getMQOperatorBox(selectorTitle));
        const popList = await this.MQOperatorPopupList;
        const isPresent = await popList.isDisplayed();
        if (!isPresent) {
            await this.clickOnElement(await this.getMQOperatorBox(selectorTitle));
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        const oprName = await this.getMQOperatorOption(operatorName);
        await this.waitForElementVisible(oprName);
        await this.waitForElementEnabled(oprName);
        await this.waitForElementClickable(oprName);
        await this.clickOnElement(oprName);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        if (operatorName.toLowerCase() === 'highest %' || operatorName.toLowerCase() === 'lowest %') {
            await input_field.setValue(inputValue1 + '\n');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }

        if (operatorName.toLowerCase() === 'between' || operatorName.toLowerCase() === 'not between') {
            input_field = await this.$(
                `(//div[contains(@class, 'VIFilterPanel')]//div[@nm='${selectorTitle}']//input[contains(@class,'TextBox') and contains(@style,'inline')])[2]`
            );
            await this.clear({ elem: input_field });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            await input_field.setValue(inputValue2 + '\n');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    /**
     * for metric slider selector, by inputing values in slider text box
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {double} startValue the input value for the left knob, if default, means using the starting point of the dataset
     * @param {double} stopValue the input value for the right knob,if default, means using the end point of the dataset
     */
    async metricSliderSelector(selectorTitle, startValue, stopValue) {
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        let inputBox;

        if (startValue !== 'default') {
            let leftKnob = await this.getSliderKnob(selectorTitle, 'left');
            const present = await leftKnob.isDisplayed();

            if (!present) {
                leftKnob = await this.getSliderKnobAfterReplacingObject(selectorTitle, 'left');
            }
            await this.hoverMouseOnElement(leftKnob);
            await this.clickOnElement(leftKnob);
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            inputBox = await this.sliderInputBox;
            await this.clear({ elem: inputBox });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            await inputBox.setValue(startValue + '\n');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }

        if (stopValue !== 'default') {
            let rightKnob = await this.getSliderKnob(selectorTitle, 'right');
            const present = await rightKnob.isDisplayed();

            if (!present) {
                rightKnob = await this.getSliderKnobAfterReplacingObject(selectorTitle, 'right');
            }
            await this.hoverMouseOnElement(rightKnob);
            await this.clickOnElementByInjectingScript(rightKnob);
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            inputBox = await this.sliderInputBox;
            await this.clickOnElement(inputBox);
            await this.clear({ elem: inputBox });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            await inputBox.setValue(stopValue + '\n');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    /**
     * Open the calendar for calendar selector, by clicking on the calendar icon.
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} fromOrTo you can input "from" or "to"
     */
    async openCalendar(selectorTitle, fromOrTo) {
        const fromOrToBox = fromOrTo + '-box';
        await this.clickOnElement(await this.getCalendarIcon(selectorTitle, fromOrToBox));
        await this.sleep(2);
    }

    /**
     * calendar style selector manipulation, by typing in the date range in the text box for calendar
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} fromDate date format should be consistent with locale, e.g. "07/23/2015" in English, while "23.07.2015" in German; "default" if you don't want to change date/time range
     * @param {string} toDate
     */
    async calendarSelector(selectorTitle, fromDate, toDate) {
        const from = await this.getCalendarTextBox(selectorTitle, 'from');
        const to = await this.getCalendarTextBox(selectorTitle, 'to');

        if (fromDate.toLowerCase() !== 'default') {
            await this.clickOnElement(from);
            await this.sleep(1);
            await this.clear(from);
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            await this.sleep(1);
            await from.setValue(fromDate + '\n');
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            await this.sleep(2);
        }

        // Add null check
        if (toDate.toLowerCase() !== null && toDate.length !== 0) {
            if (toDate.toLowerCase() !== 'default') {
                await this.clickOnElement(to);
                await this.sleep(1);
                await this.clear(to);
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
                await this.sleep(1);
                await to.setValue(toDate + '\n');
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
                await this.sleep(1);
            }
        }
    }

    /** select the Year in calendar
     * @param {string} year
     */
    async pickYear(year) {
        //await this.clickOnElement(this.$("//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]"));
        //await this.sleep('2');
        await this.clickOnElement(this.yearLabel);
        await this.sleep('2');
        await this.clickOnElement(this.getYear(year));
        await this.sleep('2');
    }

    /** select the Month in calendar
     * @param {string} month
     */
    async pickMonth(month) {
        let monthAlias = month;
        switch (month.toLowerCase()) {
            case 'january':
            case 'jan':
            case '1':
            case '01':
                monthAlias = 'Jan';
                break;

            case 'february':
            case 'feb':
            case '2':
            case '02':
                monthAlias = 'Feb';
                break;

            case 'march':
            case 'mar':
            case '3':
            case '03':
                monthAlias = 'Mar';
                break;

            case 'april':
            case 'apr':
            case '4':
            case '04':
                monthAlias = 'Apr';
                break;

            case 'may':
            case '5':
            case '05':
                monthAlias = 'May';
                break;

            case 'june':
            case 'jun':
            case '6':
            case '06':
                monthAlias = 'Jun';
                break;

            case 'july':
            case 'jul':
            case '7':
            case '07':
                monthAlias = 'Jul';
                break;

            case 'august':
            case 'aug':
            case '8':
            case '08':
                monthAlias = 'Aug';
                break;

            case 'september':
            case 'sep':
            case '9':
            case '09':
                monthAlias = 'Sep';
                break;

            case 'october':
            case 'oct':
            case '10':
                monthAlias = 'Oct';
                break;

            case 'november':
            case 'nov':
            case '11':
                monthAlias = 'Nov';
                break;

            case 'december':
            case 'dec':
            case '12':
                monthAlias = 'Dec';
                break;
        }

        //await this.clickOnElement(this.$("//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]"));
        //await this.sleep('2');
        await this.clickOnElement(this.monthLabel);
        await this.sleep('2');
        await this.clickOnElement(this.getMonth(monthAlias));
        await this.sleep('2');
    }

    /** select the Day in calendar
     * @param {string} day
     */
    async pickDay(day) {
        //await this.clickOnElement(this.$("//div[contains(@class, 'mstrmojo-Popup mstrmojo-DateTextBox-calendar') and contains(@style, 'block')]"));
        //await this.sleep('2');
        await this.clickOnElement(this.getDay(day));
        await this.sleep('2');
    }

    /** select the year, month, day in calendar
     *
     */
    async pickDate(year, month, day) {
        await this.pickYear(year);
        await this.pickMonth(month);
        await this.pickDay(day);
    }
    // Assertion helpers

    /** change metric selector between "Qualify on Rank" and "Qualify on Value"
     * @param {string} selectorTitle
     * @param {string} type metric selector type, including rank and value
     */
    async switchMetricSelectorType(selectorTitle, type) {
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);

        if (type.toLowerCase() === 'rank') {
            await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.QUALITY_ON_RANK));
            await this.sleep(1);
        } else if (type.toLowerCase() === 'value') {
            await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.QUALIFY_ON_VALUE));
            await this.sleep(1);
        }
    }

    /** select the operator for metric qualification
     * @param {string} selectorTitle
     * @param {string} operatorName
     */
    async switchMQOperator(selectorTitle, operatorName) {
        //await this.resetSelectorMenuIcon(selectorTitle);
        await this.clickOnElement(this.getMQOperatorBox(selectorTitle));
        await this.sleep(2);
        await this.clickOnElement(this.getMQOperatorOption(operatorName));
        await this.sleep(2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * This assumes that context menu is already opened.
     * Allows user to toggle between showing and hiding the (All) Element
     */
    async toggleShowOptionForAll() {
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.SHOW_OPTION_FOR_ALL));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * This assumes that context menu is already opened.
     * Selects one of the options only available in presentation mode.
     * @params {String} option - Select All, Clear All, Reset to Dynamic
     */
    async selectPresentationModeMenuItem(option) {
        let item;
        switch (option) {
            case 'Reset to Dynamic':
                item = SelectorContextMenuItem.RESET_TO_DYNAMIC;
                break;

            case 'Select All':
                item = SelectorContextMenuItem.SELECT_ALL;
                break;

            case 'Clear All':
                item = SelectorContextMenuItem.CLEAR_ALL;
                break;

            default:
                item = option;
        }

        await this.clickOnElement(await this.getSelectorContextMenuItem(item));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * This assumes that context menu is already opened.
     * Selects the option Clear All only available in presentation mode.
     */
    async clearAllElements() {
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.CLEAR_ALL));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Start Dynamic Selection Actions **/
    /**
     * Open submenu by clicking Dynamic Selection from selector context menu
     * @param {*} selectorTitle
     */
    async openDynamicSelectionMenu() {
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.DYNAMIC_SELECTION));
    }

    /**
     * This assumes that context menu is already opened.
     * Selects the option Reset to Dynamic only available in presentation mode.
     */
    async resetToDynamic() {
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.RESET_TO_DYNAMIC));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Assumes that dynamic selection menu is already opened
     *
     * @param {String} status "First N Elements", "Last N Elements", "First Element", "Last Element"
     * @param {int} quantity > 1
     * @param {boolean} holdSubmit if true, will not press OK
     */
    async configDynamicSelection(status, quantity, disableClear = false, holdSubmit) {
        if (status) {
            const statusPulldown = await this.getDynamicSelectionStatusPulldown();
            await this.waitForElementClickable(statusPulldown);
            await browser.pause(1 * 1000);
            await this.clickOnElement(statusPulldown);
            await this.clickOnElement(await this.common.getPopupListItem(status));
        }

        if (quantity) {
            const inputBox = await this.getDynamicSelectionInput();
            await this.clickOnElement(inputBox);
            await this.clear({ elem: inputBox });
            await inputBox.setValue(quantity);
            await browser.keys(Key.Enter);
        }

        if (disableClear) {
            await this.toggleDisableClearCheckbox();
        }

        if (!holdSubmit) {
            await this.clickOnElement(await this.common.getContextMenuButton('OK'));
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async toggleDisableClearCheckbox() {
        await this.clickOnElement(this.disableClearCheckbox);
    }

    /**
     * Assumed that user already defined dynamic selection and is clickable
     * @param {*} selectorTitle
     */
    async toggleDynamicSelectionIcon(selectorTitle) {
        await this.clickOnElementByInjectingScript(await this.getSelectorDynamicSelectionIcon(selectorTitle));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Open submenu by clicking Sort by ___ from selector context menu
     * Or does sorting action immediately when there's no submenu
     *
     * @param {*} selectorTitle
     * @param {*} sortType descending, ascending
     */
    async openSortingMenu(sortType) {
        let sortOption = SelectorContextMenuItem.SORT_ASC;

        if (sortType.toLowerCase() === 'descending') {
            sortOption = SelectorContextMenuItem.SORT_DESC;
        }
        // click to open submenu or sort
        await this.clickOnElement(this.getSelectorContextMenuItem(sortOption));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Click option "Clear Sort..." to send action and wait for loading dialog
     */
    async clearSort() {
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.CLEAR_SORT));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Choose form to sort by in the submenu
     * @param {*} form ID, DESC
     */
    async sortElementsByForm(form) {
        await this.clickOnElement(this.getSortingAttributeForm(form));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Open submenu for dossier level or chapter level by clicking Apply Selections To
     */
    async openSyncMenu() {
        // click to open submenu
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.SYNC_OPTION));
    }

    /**
     * Choose level in which to sync by in the "Apply Selections To" submenu
     * @param {*} syncOption "This Chapter Only", "All Chapters Containing This Filter"
     */
    async applySelectionsTo(syncOption) {
        await this.clickOnElement(this.getMenuSyncOption(syncOption));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async moveFilterPanelScrollBar(direction, pixels) {
        const orientation = direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal',
            scrollbar = await this.getFilterPanelScrollBar(orientation),
            numOfPixels = direction === 'top' ? -pixels : pixels;

        await this.dragAndDropByPixel(
            scrollbar,
            orientation === 'horizontal' ? numOfPixels : 0,
            orientation === 'vertical' ? numOfPixels : 0,
            true
        );
    }

    async clickOnSelectorMenuOption(menu) {
        const menuItem = this.getSelectorContextMenuItem(menu);
        await this.clickOnElement(menuItem);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setParameterSelectorInputValueByName(name, value) {
        const inputField = await this.getMQInputBox(name);
        await this.clickOnElement(inputField);
        await this.clear(inputField);
        await inputField.setValue(value);
        await browser.keys(Key.Enter);
        await this.sleep(3);
    }

    async resetToDefault(selectorTitle) {
        //await this.resetContextMenu(selectorTitle);
        await this.resetSelectorMenuIcon(selectorTitle);
        await this.toggleSelectorMenu(selectorTitle);
        await this.clickOnElement(this.getSelectorContextMenuItem(SelectorContextMenuItem.RESET_TO_DEFAULT));
        await this.sleep(3);
    }

    async setParameterSliderSelectorValue(selectorTitle, value) {
        await this.clickOnElement(this.getParameterSliderKnob(selectorTitle));
        const inputBox = await this.sliderInputBox;
        //await browser.waitUntil(inputBox.isDisplayed(),2000);
        await this.clickOnElement(inputBox);
        await this.clear(inputBox);
        await inputBox.setValue(value);
        await browser.keys(Key.Enter);
    }
}
