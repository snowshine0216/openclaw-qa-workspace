import BaseContainer from './BaseContainer.js';
import DatasetPanel from './DatasetPanel.js';
import { FilterPanel } from '../dossierEditor/FilterPanel.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import { scrollIntoView } from '../../utils/scroll.js';

const SelectorContextMenu = {
    INCLUDE: 'Include',
    EXCLUDE: 'Exclude',
    UNSET_FILTER: 'Unset Filter',
    DISPLAY_STYLE: 'Display Style',
    DISPLAY_ATTRIBUTE_FORMS: 'Display Attribute Forms',
    ALLOW_MULITPLE_SELECTION: 'Allow Multiple Selection',
    EDIT_TARGETS: 'Edit Targets...',
    SHOW_TITLE_BAR: 'Show Title Bar',
    HIDE_TITLEBAR: 'Hide Titlebar',
    QUALIFY_ON_VALUE: 'Qualify on Value',
    QUALIFY_ON_RANK: 'Qualify on Rank',
    FORMAT: 'Format',
    DELETE: 'Delete',
    RENAME: 'Rename',
    RESET_TO_DEFAULT: 'Reset to Default',
    COPY_FORMATTING: 'Copy Formatting',
    PASTE_FORMATTING: 'Paste Formatting',
};

/**
 * Page Object for In-Canvas Selectors
 * @extends BaseContainer
 * @author: Ajay Adithya Rajagopal <arajagopal@microstrategy.com>
 */
export default class InCanvasSelector_Authoring extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.datasetPanel = new DatasetPanel();
        this.filterPanel = new FilterPanel();
    }

    //ELEMENT LOCATORS

    /**
     * get In-Canvas Selector
     * @type {Promise<ElementFinder>}
     */
    get inCanvasSelectorButton() {
        return this.$(`//div[contains(@class, 'mstrmojo-RootView-toolbar')]//div[contains(@class, 'insertFlt')]`);
    }

    /**
     * get Element/Value filter from selector drop down
     * @type {Promise<ElementFinder>}
     */
    get elementOrValueFilter() {
        return this.$(`//div[contains(@class, 'vi-toolbarMenu')]//a[contains(@class, 'insertFlt')]`);
    }

    /**
     * get Attribute/Metric Selector
     * @type {Promise<ElementFinder>}
     */
    get attrOrMetricSelector() {
        return this.$(`//div[contains(@class, 'vi-toolbarMenu')]//a[contains(@class, 'insertAMSelector')]`);
    }

    get panelSelector() {
        return this.$(`//div[contains(@class, 'vi-toolbarMenu')]//a[contains(@class, 'insertPanelSelector')]`);
    }

    get parameterSelector() {
        return this.$(`//div[contains(@class, 'vi-toolbarMenu')]//a[contains(@class, 'insertParameterSelector')]`);
    }

    /**
     * get Element/Value filter container
     * @type {Promise<ElementFinder>}
     */
    getElementOrValueFilterUsingId(index) {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and not(contains(@class,'ParameterSelector'))])[${index}]`
        );
    }

    getSelectorElementByIndex(index, elementName) {
        //return this.getElementOrValueFilterUsingId(index).$(`//*[text()='${elementName}']`)
        return this.$(`(//div[contains(@class, 'mstrmojo-FilterBox')])[${index}]//*[text()='${elementName}']`);
    }

    getSelectorElementCheckedByIndex(index, elementName) {
        return this.getSelectorElementByIndex(index, elementName).$(`./parent::div[contains(@class, 'selected')]`);
    }

    getSelectorElementUncheckedByIndex(index, elementName) {
        return this.getSelectorElementByIndex(index, elementName).$(`./parent::div[not(contains(@class, 'selected'))]`);
    }

    getEmptyElementOrValueFilterUsingId(index) {
        let elements = this.$$(
            `//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox'))]//div[contains(@class,'dropMsg')]`
        );
        return elements[index];
    }

    getElementOrValueFilterByTitle(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and .//div[@nm = '${selectorTitle}']]`
        );
    }

    getElementOrValueFilterByDisplayTitle(selectorDisplayTitle) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and .//div[@aria-label = '${selectorDisplayTitle}']]`
        );
    }

    getDropDownStyleSelectorByDisplayTitle(selectorDisplayTitle) {
        return this.$(`//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and .//div[@aria-label = '${selectorDisplayTitle}']]//div[contains(@class,'Pulldown')]/div[contains(@class,'Pulldown')]`);
    }

    getSearchBoxStyleSelectorByDisplayTitle(selectorDisplayTitle) {
        return this.$(`//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and .//div[@aria-label = '${selectorDisplayTitle}']]//div[contains(@class,'SearchBoxSelector')]`);
    }

    getLinkBarStyleSelectorByDisplayTitle(selectorDisplayTitle) {
        return this.$(`//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and .//div[@aria-label = '${selectorDisplayTitle}'] and @aria-roledescription="Link Bar"]`);
    }

    getMetricSliderSelectorByDisplayTitle(selectorDisplayTitle) {
        return this.$(`//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and .//div[@aria-label = '${selectorDisplayTitle}' and //div[@aria-roledescription="Slider"]]]`);
    }

    getQualificationSelectorByDisplayTitle(selectorDisplayTitle) {
        return this.$(`//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class, 'mstrmojo-AMSelectorBox')) and .//div[@aria-label = '${selectorDisplayTitle}' and //div[@aria-roledescription="Qualification"]]]`);
    }

    getVisibleTitleBar(selectorTitle) {
        return this.$(
            `//div[contains(@class,'FilterBox')]//div[contains(@class,'VITitleBar') and contains(@style,'display: block;')]//div[contains(@class,'title-text')]/div[text()='${selectorTitle}']`
        );
    }

    getCurrentSelectorTitleBar() {
        return this.$(
            `//div[contains(@class,'FilterBox') and contains(@class,'selected')]//div[contains(@class,'VITitleBar') and contains(@style,'display: block;')]//div[contains(@class,'title-text')]/div`
        );
    }

    getSelectedPanel() {
        return this.$$('.mstrmojo-VITextBox').filter(async (elem) => await elem.isDisplayed())[0];
    }

    getSelectorTitleBarUsingId(index) {
        return this.$(
            `(//div[contains(@class,'FilterBox')]//div[contains(@class,'VITitleBar') and contains(@style,'display: block;')]//div[contains(@class,'title-text')]/div)[${index}]`
        );
    }

    /**
     * get Attribute/Metric selector container
     * @type {Promise<ElementFinder>}
     */
    getAttrOrMetricSelectorContainerUsingId(index) {
        return this.$(`//div[contains(@class, 'mstrmojo-FilterBox mstrmojo-AMSelectorBox')][${index}]`);
    }

    getParameterSelectorContainerUsingId(index) {
        return this.$(
            `(//div[contains(@class,'mstrmojo-DocPanel-wrapper') and contains(@style,'display: block;')]//div[contains(@class,'mstrmojo-ParameterSelectorBox') and contains(@style,'display: block;')])[${index}]`
        );
    }

    getParameterSelectorContainerInputUsingId(index) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ParameterSelectorBox') and contains(@style,'display: block;')][${index}]//input`
        );
    }

    getParameterSelectorByTitle(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ParameterSelectorBox') and contains(@style,'display: block;') and .//div[@nm = '${selectorTitle}']]`
        );
    }

    getParameterSelectorInputByTitle(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ParameterSelectorBox') and contains(@style,'display: block;') and .//div[@nm = '${selectorTitle}']]//input`
        );
    }

    getPararameterSelectorVisibleTitleBar(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ParameterSelectorBox') and contains(@style,'display: block;')]//div[contains(@class,'VITitleBar') and contains(@style,'display: block;')]//div[text()='${selectorTitle}']`
        );
    }

    getParameterSliderKnob(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[@nm='${selectorTitle}']//div[contains(@class,'VISlider')]//div[@class='sd']/div[contains(@class,'t3')]`
        );
    }

    getParameterCalendarIcon(selectorTitle) {
        return this.$(
            `//div[contains(@class,'DocSelector') and @nm='${selectorTitle}' and contains(@style,'display: block;')]//div[@class='mstrmojo-DateTextBox-icon']`
        );
    }

    /**
     * get select target button within in-canvas selector
     * @type {Promise<ElementFinder>}
     */
    getSelectTargetButton(selectorTitle) {
        //return this.$$('.FilterBox').filter(async (elem) => (await elem.getText()).includes(selectorTitle))[0].$('.btn-select-targets');
        return this.$(
            `//div[contains(@class,'FilterBox')]//div[contains(.//text(), '${selectorTitle}')]//div[contains(@class,'btn-select-targets')]`
        );
    }

    /**
     * get candidate picker pull down for Attr/Metric selector
     * @type {Promise<ElementFinder>}
     */
    get candidatePickerPD() {
        return this.$(`//div[contains(@class, 'candidate-picker')]//div[contains(@class, 'candiPickerPulldown')]`);
    }

    get applyButtonFromFilterBoxDialog() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-TargetSelector')]/div/div[3]//div[@class = 'mstrmojo-Button-text ']`
        );
    }

    get cancelButtonFromFilterBoxDialog() {
        return this.$(`//div[contains(@class, 'mstrmojo-TargetSelector')]/div/div[2]`);
    }

    getCandidateFromCandidatePD(unitName) {
        return this.candidatePickerPD.$(`//div[text() = '${unitName}']`);
    }

    getTargetFromSelectTargetPopup(vizName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-FilterBox-targets')]//div[contains(@class, 'mstrmojo-ui-CheckList')]//span[text() = '${vizName}']`
        );
    }

    getCheckBoxforTarget(targetName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-FilterBox-targets')]//div[contains(@class, 'mstrmojo-ui-CheckList')]//div[contains(@class,'item') and descendant::span[text() = '${targetName}']]`
        );
    }

    get selectTargetApplyButton() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-vi-FilterBox-targets')]//div[@class='me-buttons']/div[position() = 1]`
        );
    }

    /**
     * @param {string} visualizationName
     * @type {Promise<ElementFinder>}
     * */
    get visualizationTitleBarTextArea() {
        return this.$$(
            `(//div[contains(@class,'mstrmojo-UnitContainer') and contains(@class, 'mstrmojo-VIBox')]//div[contains(@class, 'title-text') and contains(@style, 'width')])`
        )[0];
    }

    /** Return the knob of the slider selector
     * @param {string} selectorTitle the title of the selector
     * @param {string} sliderDirection "left" or "right" knob of the slider, the input for this parameter is left or right
     * @returns {Promise<ElementFinder>} the knob of the slider
     */
    getSliderKnob(selectorTitle, sliderDirection) {
        let sliderPlaceholder = '';

        if (sliderDirection.toLowerCase() === 'left') {
            sliderPlaceholder = 't1';
        } else {
            sliderPlaceholder = 't3';
        }
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[@nm='${selectorTitle}']//div[contains(@class,'VISlider')]//div[@class='sd']/div[contains(@class,'${sliderPlaceholder}')]`
        );
    }

    /** Return the input field for the metric slider
     * @returns {Promise<ElementFinder>} the input box of the metric slider
     */
    get sliderInputBox() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Tooltip mstrmojo-VISlider') and contains(@style,'display: block;')]//input[contains(@class, 'mstrmojo-TextBox')]`
        );
    }

    /** Returns the operator pulldown for the metric qualification/rank like highest, greater than..
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the operator box of the metric qualification
     */
    getMQOperatorBox(selectorTitle) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[@nm='${selectorTitle}']//div[contains(@class,'mstrmojo-ui-Pulldown-text')]`
        );
    }

    /** Return the input field for the metric qualification
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the input box of the metric qualication
     */
    getMQInputBox(selectorTitle, boxClass) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[@nm='${selectorTitle}']//div[@class = '${boxClass}']//input[contains(@class,'mstrmojo-TextBox')]`
        );
    }

    /** Returns the element for element list style selector, including check boxes, radio buttons
     * @param {string} selectorTitle selector's title
     * @param {string} elementName element under this selector
     * @returns {Promise<ElementFinder>} the element from the selector's element list
     */
    getElementFromListSelector(selectorTitle, elementName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-FilterBox')]//div[contains(@class,'vi-DocSelector') and @nm='${selectorTitle}']//div[span[text()='${elementName}']]`
        );
    }

    /** Returns the search box selector
     * @param {string} selectorTitle selector's title
     * @returns {Promise<ElementFinder>} the search box selector
     */
    getSearchBox(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-FilterBox')]//div[contains(@class,'vi-DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'mstrmojo-SimpleObjectInputBox-container')]`
        );
    }

    /** Returns the input area for the search box selector
     * @param {string} selectorTitle selector's title
     * @returns {Promise<ElementFinder>} the input area for the search box selector
     */
    getSearchBoxInput(selectorTitle) {
        return this.$(
            `//div[contains(@class,'mstrmojo-FilterBox')]//div[contains(@class,'vi-DocSelector') and @nm='${selectorTitle}']//div[contains(@class,'mstrmojo-SimpleObjectInputBox-container')]//input`
        );
    }

    /** Returns the element from the returned result list for search box selector
     * @param {string} elementName the element of the selector object
     * @returns {Promise<ElementFinder>} the element from the returned result list
     */
    getSearchResultElement(elementName) {
        return this.$(`//div[contains(@class,'SearchBoxSelector-suggest')]//div[text()='${elementName}']`);
    }

    /** Returns the element from the bar selectors like link bar, button bar, list box
     * @param {string} selectorTitle selector's title
     * @param {string} elementName the element of the selector object
     * @returns {Promise<ElementFinder>} the element from the returned result list
     */
    getElementFromBarSelector(selectorTitle, elementName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-FilterBox')]//div[contains(@class,'vi-DocSelector') and @nm='${selectorTitle}']//div[text() = '${elementName}']`
        );
    }

    getElementFromCurrentBarSelector(elementName) {
        return this.$(
            `//div[contains(@class,'FilterBox') and contains(@class,'selected')]//div[contains(@class,'vi-DocSelector')]//div[text() = '${elementName}']`
        );
    }

    getElementSelectionAreaFromBarSelector(selectorTitle, elementName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-FilterBox')]//div[contains(@class,'vi-DocSelector') and @nm='${selectorTitle}']//div[text() = '${elementName}']/parent::div`
        );
    }

    getListSelectorElementChecked(selectorTitle, elementName) {
        return this.getElementFromListSelector(selectorTitle, elementName).$(
            `./parent::div[contains(@class, 'selected')]`
        );
    }

    getListSelectorElementUnchecked(selectorTitle, elementName) {
        return this.getElementFromListSelector(selectorTitle, elementName).$(
            `./parent::div[not(contains(@class, 'selected'))]`
        );
    }

    getBarSelectorElementChecked(selectorTitle, elementName) {
        return this.getElementFromBarSelector(selectorTitle, elementName).$(
            `./parent::div[contains(@class, 'selected')]`
        );
    }

    getBarSelectorElementUnchecked(selectorTitle, elementName) {
        return this.getElementFromBarSelector(selectorTitle, elementName).$(
            `./parent::div[not(contains(@class, 'selected'))]`
        );
    }

    /** Returns dropdown selector
     * @param {string} selectorTitle the title of the selector
     * @returns {Promise<ElementFinder>} the drop down selector
     */
    getDropDownSelector(selectorTitle) {
        return this.$(
            `${this.canvasPath}//div[contains(@class,'mstrmojo-FilterBox')]//div[contains(@class,'vi-DocSelector') and @nm='${selectorTitle}']//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    /** Returns the element from the pulldown for the single selection dropdown selector
     * @param {string} elementName the element of the selector
     * @returns {Promise<ElementFinder>} the element from the pulldown list for single selection dropdown selector
     */
    getSingleDropdownElement(elementName) {
        return this.$(`//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//*[text()='${elementName}']`);
    }

    /**
     * Returns the element from the pulldown for the multi selection dropdown selector
     * @param {*} elementName
     * @returns
     */
    getDropdownElementFromPopup(elementName) {
        return this.$(
            `//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//div[contains(@class, 'mstrmojo-ui-CheckList')]//span[text()='${elementName}']`
        );
    }

    /**
     * Returns the button from the pulldown popup of a dropdown selector
     * @param {*} buttonName OK or Cancel
     * @returns
     */
    getDropdownPopupButton(buttonName) {
        return this.$(
            `//div[contains(@class,'selector mstrmojo-ui-Pulldown')]//div[contains(@class,'mstrmojo-Button mstrmojo-WebButton')]//div[text()='${buttonName}']`
        );
    }

    getElementOrderingInSelector(selectorTitle, orderClass) {
        let path = `//div[contains(@class, 'mstrmojo-FilterBox')]//div[@nm='${selectorTitle}']//div[contains(@class, '${orderClass}')]`;

        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     if ((orderClass = orderClass === 'hasVertical')) {
        //         path = `//div[contains(@class, 'mstrmojo-FilterBox') and not(contains(@class,'horizontal'))]//div[@nm='${selectorTitle}']`;
        //     } else {
        //         path = `//div[contains(@class, 'mstrmojo-FilterBox') and contains(@class,'horizontal')]//div[@nm='${selectorTitle}']`;
        //     }
        // }

        return this.$$(path)[0];
    }

    /**
     * Assumes that dynamic selection has already been defined
     * @param {*} selectorTitle
     */
    getDynamicSelectionIconButton(selectorTitle) {
        return this.$(this.getContainerPath(selectorTitle) + `//div[contains(@class, 'dynamicSelection')]`);
    }

    getTooltip(content) {
        return this.$(`//div[contains(@class,'mstrmojo-Tooltip-content') and text()='${content}']`);
    }

    getOptionFromLinkBarAttributeMetricSelector(option) {
        return this.$(this.getContainerPath() + `//div[text() = "${option}"]`);
    }

    async resetContextMenu(selectorTitle) {
        let el = await this.visualizationTitleBarTextArea;
        let title = await this.getElementOrValueFilterByTitle(selectorTitle);
        await this.click({ elem: el });
        await this.hoverMouseOnElement(title);
    }

    /** Change display style for selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} styleName filter style that available under Display Style menu, e.g. Check Boxes, Slider, Search Box...
     */
    async createNewElementFilter() {
        await this.click({ elem: this.inCanvasSelectorButton });
        await this.click({ elem: this.elementOrValueFilter });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Change display style for selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} styleName filter style that available under Display Style menu, e.g. Check Boxes, Slider, Search Box...
     */
    async createNewAttributeMetricFilter() {
        await this.click({ elem: this.inCanvasSelectorButton });
        await this.click({ elem: this.attrOrMetricSelector });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Change display style for selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} styleName filter style that available under Display Style menu, e.g. Check Boxes, Slider, Search Box...
     */
    async createNewPanelFilter() {
        await this.click({ elem: this.inCanvasSelectorButton });
        await this.click({ elem: this.panelSelector });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag and drop object from dataset to in-canvas selector
     * @param {string} objectName
     * @param {string} objectType - attribute or metric
     * @param {string} datasetName
     * @param {string} filterIdx  optional, if not currently selected container
     */
    async dragDSObjectToSelector(objectType, objectName, datasetName, filterIdx = '', isScrollIntoView = true) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = this.datasetPanel.getObjectFromDataset(objectName, objectType, datasetName);
        if (isScrollIntoView) {
            await scrollIntoView(srcel);
        }
        // no name passed to getContainer() = currently selected selector
        let desel = filterIdx
            ? await this.getElementOrValueFilterUsingId(parseInt(filterIdx, 10))
            : await this.getContainer();

        await this.waitForElementVisible(desel);
        //await ngmEditorPanel.dragAndDropObjectAndWait(srcel, desel);
        await this.dragAndDropForAuthoring({ fromElem: srcel, toElem: desel });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickSelectTargetButton(selectorTitle) {
        await this.click({ elem: this.getSelectTargetButton(selectorTitle) });
    }

    async clickApplyButtonFromFilterBoxDialog() {
        const applyButton = this.applyButtonFromFilterBoxDialog;
        await this.waitForElementVisible(applyButton);
        await this.click({ elem: applyButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** select one or more in-canvas filters as target for an in-canvas filter
     * @param {string} trgtFilterNames
     * @param {string} trgtVizNames
     */
    async selectTargetFilterFromWithinSelector(trgtFilterNames, selectorTitle) {
        await this.click({ elem: this.getSelectTargetButton(selectorTitle) });

        const trgtFilterList = trgtFilterNames.split(',');
        for (const target of trgtFilterList) {
            await this.click({ elem: this.getElementOrValueFilterByTitle(target) });
        }

        const applyButton = this.applyButtonFromFilterBoxDialog;
        await this.waitForElementVisible(applyButton);
        await this.click({ elem: applyButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** select one or more Visualizations as target for an in-canvas filter
     * @param {string} trgtFilterNames
     * @param {string} trgtVizNames
     */
    async selectTargetVizFromWithinSelector(trgtVizNames, selectorTitle, replaceObjectName = null) {
        await this.click({ elem: this.getSelectTargetButton(selectorTitle) });

        const trgtVizList = trgtVizNames.split(',');
        for (const target of trgtVizList) {
            await this.click({ elem: this.getContainer(target) });
        }

        // add replace object for attribute/metric filter
        const flag = await this.candidatePickerPD.isDisplayed();
        if (flag && replaceObjectName != null) {
            await this.click({ elem: this.candidatePickerPD });
            await this.click({ elem: this.getCandidateFromCandidatePD(replaceObjectName) });
        }

        const applyButton = this.applyButtonFromFilterBoxDialog;
        await this.waitForEitherElemmentVisible(applyButton);
        await this.click({ elem: applyButton });
        await this.checkNonPresenceOfDynamicSelIcon(selectorTitle);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    /** select one or more in-canvas filters and Visualizations as target for an in-canvas filter
     * @param {string} trgtFilterNames
     * @param {string} trgtVizNames
     */
    async selectTargetsFromWithinSelector(trgtFilterNames, trgtVizNames, selectorTitle) {
        await this.click({ elem: this.getSelectTargetButton(selectorTitle) });

        if (trgtFilterNames) {
            const trgtFilterList = trgtFilterNames.split(',');
            for (const target of trgtFilterList) {
                await this.click({ elem: this.getElementOrValueFilterByTitle(target) });
            }
        }

        if (trgtVizNames) {
            const trgtVizList = trgtVizNames.split(',');
            for (const target of trgtVizList) {
                await this.click({ elem: this.getContainer(target) });
            }
        }

        const applyButton = this.applyButtonFromFilterBoxDialog;
        await this.click({ elem: applyButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectTargets(trgtFilterNames, trgtVizNames) {
        if (trgtFilterNames) {
            const trgtFilterList = trgtFilterNames.split(',');
            for (const target of trgtFilterList) {
                await this.click({ elem: this.getElementOrValueFilterByTitle(target) });
            }
        }

        if (trgtVizNames) {
            const trgtVizList = trgtVizNames.split(',');
            for (const target of trgtVizList) {
                const container = await this.getContainer(target);
                await container.waitForDisplayed({ timeout: 30000 });
                await this.waitForElementClickable(container);
                await this.click({ elem: container });
            }
        }
    }

    /**
     * Cancel selecting a target for the selector
     */
    async cancelSelectTargetForSelector() {
        const cancelButton = this.cancelButtonFromFilterBoxDialog;
        await this.click({ elem: cancelButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.sleep(1);
    }

    // following are the actions for context menu

    async selectTargetForSelectorContextMenu(selectorTitle, targets) {
        await this.resetContextMenu(selectorTitle);
        await this.openContextMenu(selectorTitle);

        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.SELECT_TARGETS) });
        const targetList = targets.split(',');
        for (const target of targetList) {
            await this.click({ elem: this.getTargetFromSelectTargetPopup(target) });
        }

        let applyBtn = await this.selectTargetApplyButton;
        await this.click({ elem: this.selectTargetApplyButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openSelectorTargetsMenu(selectorTitle) {
        await this.resetContextMenu(selectorTitle);
        await this.openContextMenu(selectorTitle);

        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.EDIT_TARGETS) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openCurrentSelectorTargetsMenu() {
        await this.openContextMenu();

        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.EDIT_TARGETS) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Change display style for selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} styleName filter style that available under Display Style menu, e.g. Check Boxes, Slider, Search Box...
     */
    async changeDisplayStyle(selectorTitle, styleName) {
        await this.resetContextMenu(selectorTitle);
        await this.openContextMenu(selectorTitle);
        let el1 = await this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.DISPLAY_STYLE);

        await this.click({ elem: el1 });
        let el2 = await this.filterPanel.getSelectorDisplayStyle(styleName);

        await this.click({ elem: el2 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async changeDisplayStyleforSelectedSelector(styleName) {
        await this.openContextMenu();
        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.DISPLAY_STYLE) });
        await this.click({ elem: this.filterPanel.getSelectorDisplayStyle(styleName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Select display forms for the in-canvas selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} formNames the display form names for the selector
     */
    async selectAttributeDisplayForms(selectorTitle, formNames) {
        await this.resetContextMenu(selectorTitle);
        await this.openContextMenu(selectorTitle);
        await this.click({
            elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.DISPLAY_ATTRIBUTE_FORMS),
        });
        let forms = formNames.split(',');
        for (let i = 0; i < forms.length; i++) {
            await this.click({ elem: this.filterPanel.getDisplayForm(forms[i]) });
        }

        await this.click({ elem: this.filterPanel.getButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Open the display form menu for the given selector
     * @param {string} selectorTitle  the selector's title
     */
    async openAttributeDisplayFormsMenu(selectorTitle) {
        await this.resetContextMenu(selectorTitle);
        await this.openContextMenu(selectorTitle);
        await this.click({
            elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.DISPLAY_ATTRIBUTE_FORMS),
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Switch between "Include" and "Exclude" for the selector
     * @param {string} selectorTitle the unit name, usually it's the attribute name based on which the filter is created on
     * @param {string} modeName Include or Exclude
     */
    async changeSelectorMode(selectorTitle, modeName) {
        await this.resetContextMenu(selectorTitle);

        await this.openContextMenu(selectorTitle);
        let selMode;
        if (modeName.toLowerCase() === 'include') {
            selMode = SelectorContextMenu.INCLUDE;
        } else {
            selMode = SelectorContextMenu.EXCLUDE;
        }
        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(selMode) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Unset filter for individual selector
     * @param {string} selectorTitle unit name, usually it's the attribute name based on which the filter is created on
     */
    async unsetSelectorFilter(selectorTitle) {
        await this.resetContextMenu(selectorTitle);

        await this.openContextMenu(selectorTitle);
        
        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.UNSET_FILTER) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Unset filter for current selected selector
     */
    async unsetCurrentSelectorFilter() {
        await this.openContextMenu();
        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.UNSET_FILTER) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Unset filter for individual selector
     * @param {string} selectorTitle unit name, usually it's the attribute name based on which the filter is created on
     */
    async toggleMultipleSelection(selectorTitle) {
        await this.resetContextMenu(selectorTitle);

        await this.openContextMenu(selectorTitle);
        await this.click({
            elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.ALLOW_MULITPLE_SELECTION),
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async toggleMultipleSelectionforSelectedSelector() {
        await this.openContextMenu();
        await this.click({
            elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.ALLOW_MULITPLE_SELECTION),
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // actions for metric selectors

    /**
     * for metric slider selector, by inputing values in slider text box
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {double} startValue the input value for the left knob, if default, means using the starting point of the dataset
     * @param {double} stopValue the input value for the right knob,if default, means using the end point of the dataset
     */
    async metricSliderSelectorOnVal(selectorTitle, startValue, stopValue) {
        let inputBox = await this.sliderInputBox;

        if (startValue !== 'default') {
            await this.click({ elem: await this.getSliderKnob(selectorTitle, 'left') });
            await this.clear({ elem: inputBox });
            await inputBox.setValue(parseInt(startValue, 10) + '\n');
        }

        if (stopValue !== 'default') {
            await this.click({ elem: await this.getSliderKnob(selectorTitle, 'right') });
            await this.clear({ elem: inputBox });
            await inputBox.setValue(parseInt(startValue, 10) + '\n');
        }
    }

    /** change metric selector between "Qualify on Rank" and "Qualify on Value"
     * @param {string} selectorTitle
     * @param {string} type metric selector type, including rank and value
     */
    async switchMetricSelectorType(selectorTitle, type) {
        await this.hoverMouseOnElement(await this.getElementOrValueFilterByTitle(selectorTitle));
        await this.openContextMenu(selectorTitle);

        if (type.toLowerCase() === 'rank') {
            await this.click({
                elem: await this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.QUALIFY_ON_RANK),
            });
        } else {
            await this.click({
                elem: await this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.QUALIFY_ON_VALUE),
            });
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async metricSliderSelectorOnRank(selectorTitle, rankType, value) {
        let inputBox = await this.sliderInputBox;
        await this.hoverMouseOnElement(await this.getElementOrValueFilterByTitle(selectorTitle));
        await this.click({ elem: await this.getMQOperatorBox(selectorTitle) });
        await this.sleep(1);

        let rank = await this.filterPanel.getMQOperatorOption(rankType);
        await this.click({ elem: rank });
        await this.sleep(1);

        let rightKnob = this.getSliderKnob(selectorTitle, 'right');
        await this.click({ elem: rightKnob });
        await this.sleep(1);
        await inputBox.click();
        await this.clear(inputBox);
        await inputBox.setValue(parseInt(value, 10) + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** for Metric Qualification style selector manipulation based on Value.
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} operatorName  available option for MQ selector, e.g. "Greater than","Less than", etc.
     * @param {string} inputValue1
     * @param {string} inputValue2
     */
    async metricQualificationSelectorOnValue(selectorTitle, operatorName, inputValue1, inputValue2) {
        await this.click({ elem: await this.getMQOperatorBox(selectorTitle) });
        await this.click({ elem: await this.filterPanel.getMQOperatorOption(operatorName) });

        let input_field = this.getMQInputBox(selectorTitle, 'v1');
        await this.clear(input_field);
        await input_field.setValue(inputValue1 + '\n');

        if (operatorName.toLowerCase() === 'between' || operatorName.toLowerCase() === 'not between') {
            input_field = await this.getMQInputBox(selectorTitle, 'v2');
            await this.clear(input_field);
            await input_field.setValue(inputValue2 + '\n');
        }
    }

    /** for Metric Qualification style selector manipulation based on rank
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} rankType  available option for MQ selector, e.g. "Greater than","Less than", etc.
     * @param {string} value    Rank or Value you want to set the the metric to
     */
    async metricQualificationSelectorOnRank(selectorTitle, rankType, value) {
        let el = await this.getMQOperatorBox(selectorTitle);
        await this.click({ elem: el });
        let el2 = await this.filterPanel.getMQOperatorOption(rankType);
        await this.click({ elem: el2 });

        let input_field = await this.getMQInputBox(selectorTitle, 'v1'),
            modifiedVal = value ? value : ''; // the "value" param may be null if it is empty string in feature file
        await this.clear(input_field);
        await input_field.setValue(modifiedVal + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** for Metric Qualification style selector manipulation based on null value
     * @param {string} selectorTitle the selector's title, usually it's the attribute/metric name based on which the filter is created on
     * @param {string} operatorType  available option for MQ selector, e.g. is null, not null
     */
    async metricQualificationSelectorOnNullValue(selectorTitle, operatorType) {
        // make the tooltip disappear before clicking on pulldown
        await this.click({ elem: this.getElementOrValueFilterByTitle(selectorTitle) });
        let operatorPD = this.getMQOperatorBox(selectorTitle);
        await this.click({ elem: operatorPD });
        await this.click({ elem: this.filterPanel.getMQOperatorOption(operatorType) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // actions for attribute selectors

    /** Click(select or de-select) on the element for the element list style selector, including check boxes, radio buttons
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} elementNames the elements from the element list of the selector
     */
    async checkElementList(selectorTitle, elementNames) {
        const elements = elementNames.split(',');
        for (let element of elements) {
            await this.click({ elem: this.getElementFromListSelector(selectorTitle, element.replace(/ /g, '\u00A0')) });
            await this.moveToPosition({ x: 0, y: 0 });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async checkElementListByIndex(index, elementNames, isSpaceNotReplaced = false) {
        const elements = elementNames.split(',');
        for (let element of elements) {
            if (isSpaceNotReplaced) {
                await this.click({ elem: this.getSelectorElementByIndex(index, element) });
            } else {
                await this.click({ elem: this.getSelectorElementByIndex(index, element.replace(/ /g, '\u00A0')) });
            }
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    /** Search and select the element from the returned result list for search box selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern the user input used to search
     * @param {string} elementName the elements from the returned result list for the search
     */
    async searchBoxSelector(selectorTitle, searchPattern, elementName) {
        let searchBoxInput = this.getSearchBoxInput(selectorTitle);
        let searchBox = this.getSearchBox(selectorTitle);
        await this.click({ elem: searchBox });
        await searchBoxInput.setValue(searchPattern);

        await this.click({ elem: this.getSearchResultElement(elementName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Search but without selecting the element from the returned result list for search box selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern the user input used to search
     */
    async searchBoxSelectorWithoutSelecting(selectorTitle, searchPattern) {
        let searchBoxInput = await this.getSearchBoxInput(selectorTitle);
        let searchBox = await this.getSearchBox(selectorTitle);
        await this.click({ elem: searchBox });
        await searchBoxInput.setValue(searchPattern);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Select the element from the returned result list for search box selector
     * @param {string} elementName the selector's title, usually it's the attribute name based on which the filter is created on
     */
    async selectElementInSearchBox(elementName) {
        await this.click({ elem: this.getSearchResultElement(elementName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Clear the search box
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     */
    async clearSearchBox(selectorTitle) {
        let searchBoxInput = await this.getSearchBoxInput(selectorTitle);
        let searchBox = await this.getSearchBox(selectorTitle);
        await this.click({ elem: searchBox });
        await this.clear({ elem: searchBoxInput });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Search but without selecting the element from the returned result list for dropdown selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} searchPattern the user input used to search
     */
    async searchInDropdownSelector(selectorTitle, searchPattern) {
        let dropdownInput = await this.getDropDownSelector(selectorTitle);
        await this.click({ elem: dropdownInput });
        await this.clear(dropdownInput);
        await dropdownInput.addValue(searchPattern);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Select elements after searching in dropdown selector or when opening dropdown selector and popup is visible
     * @param {*} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {*} elements comma separated list (no spaces between each element)
     * @param {*} skipOpeningPopup flag set by step: true when selecting elements after search
     */
    async selectElementsInDropdown(selectorTitle, elements, skipOpeningPopup) {
        if (!skipOpeningPopup) {
            const dropdownInput = await this.getDropDownSelector(selectorTitle);
            await this.click({ elem: dropdownInput });
        }

        await this.sleep(1);

        const elementsList = elements.split(',');
        for (const el of elementsList) {
            await this.click({ elem: await this.getDropdownElementFromPopup(el) });
        }
        await this.click({ elem: await this.getDropdownPopupButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /** Select the element from the link bar or button bar selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} elementNames the elements from the returned result list for the search
     */
    async linkOrButtonBarSelector(selectorTitle, elementNames) {
        const elements = elementNames.split(',');
        for (const element of elements) {
            await this.click({ elem: await this.getElementFromBarSelector(selectorTitle, element) });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async linkOrButtonCurrentBarSelector(elementNames) {
        const elements = elementNames.split(',');
        for (const element of elements) {
            await this.click({ elem: this.getElementFromCurrentBarSelector(element) });
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async linkOrButtonBarSelectorInLibrary(selectorTitle, elementNames) {
        const elements = elementNames.split(',');
        for (const element of elements) {
            await this.click({ elem: this.getElementFromBarSelector(selectorTitle, element) });
        }
    }

    /** Select the element from the link bar or button bar selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} elementNames the elements from the returned result list for the search
     */
    async listBoxSelector(selectorTitle, elementNames) {
        let elements = elementNames.split(','),
            elementsToClick = [];

        for (let element of elements) {
            let el = await this.getElementFromBarSelector(selectorTitle, element);
            elementsToClick.push(el);
        }

        await this.multiSelectElementsUsingCommandOrControl(elementsToClick, true);
    }

    async openDropDownSelectorPullList(selectorTitle) {
        let dropdownInput = await this.getDropDownSelector(selectorTitle);
        await this.click({ elem: dropdownInput });
    }

    /** Select the element from the pulldown for single dropdown selector
     * @param {string} selectorTitle the selector's title, usually it's the attribute name based on which the filter is created on
     * @param {string} elementName the element of the selector
     */
    async singleDropdownSelector(selectorTitle, elementName) {
        await this.click({ elem: this.getDropDownSelector(selectorTitle) });
        await this.click({ elem: this.getSingleDropdownElement(elementName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // following are assertion functions to validate tests

    async checkPresenceOfSelectTrgtBtn(selectorTitle) {
        const btn = await this.getSelectTargetButton(selectorTitle);
        await expect(await btn.isDisplayed()).toBeTrue();
    }

    async checkNonPresenceOfDynamicSelIcon(selectorTitle) {
        const icon = await this.getDynamicSelectionIconButton(selectorTitle);
        await this.waitForElementInvisible(icon);
    }

    async checkPresenceOfDynamicSelIcon(selectorTitle) {
        await this.hoverOnContainerTitlebarAndClick(selectorTitle);
        await this.sleep(2000);

        const icon = await this.getDynamicSelectionIconButton(selectorTitle);

        const exists = await icon.isExisting();
        if (!exists) {
            return 'NA';
        }

        const classAttr = await icon.getAttribute('class');
        console.log('Dynamic Selection Icon class attribute: ' + classAttr);

        if (classAttr === 'on dynamicSelection' || classAttr === 'dynamicSelection on') {
            return 'on';
        } else if (classAttr === 'off dynamicSelection' || classAttr === 'dynamicSelection off') {
            return 'off';
        } else {
            return 'Error';
        }
    }

    async checkPresenceOfSelector(selectorTitle, selectorType) {
        let elementObj, styleName;
        switch (selectorType) {
            case 'check boxes':
                styleName = 'mstrmojo-ui-CheckList';
                break;
            case 'radio buttons':
                styleName = 'radio';
                break;
            case 'search box':
                styleName = 'mstrmojo-SearchBoxSelector';
                break;
            case 'slider':
                styleName = 'mstrmojo-Slider';
                break;
            case 'drop-down':
                styleName = ' mstrmojo-ui-SearchablePulldown';
                break;
            case 'link bar':
                styleName = 'mstrmojo-vi-sel-LinkList';
                break;
            case 'button bar':
                styleName = 'mstrmojo-vi-sel-LinkList buttons';
                break;
            case 'list box':
                styleName = 'mstrmojo-vi-sel-ListBox';
                break;
            case 'qualification':
                styleName = 'mstrmojo-vi-metric-qual';
                break;
        }
        elementObj = this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[@nm='${selectorTitle}']//div[contains(@class, '${styleName}')]`
        );
        await expect(await elementObj.isDisplayed()).toBeTrue();
    }

    async checkExcludeMode(selectorTitle, elementName, selectorType) {
        let elementObj;
        // 'bar' represents listbar, buttonbar and list box and 'list' represents check and radio btns
        if (selectorType === 'bar') {
            elementObj = this.getElementFromBarSelector(selectorTitle, elementName);
        } else if (selectorType === 'list') {
            elementObj = this.getElementFromListSelector(selectorTitle, elementName);
        }
        let styleList = await elementObj.getCSSProperty('text-decoration-line');
        let styleValue = styleList.value;
        expect(styleValue).to.equal('line-through');
    }

    async checkNotExcludeMode(selectorTitle, elementName, selectorType) {
        let elementObj;
        // 'bar' represents listbar, buttonbar and list box and 'list' represents check and radio btns
        if (selectorType === 'bar') {
            elementObj = this.getElementFromBarSelector(selectorTitle, elementName);
        } else if (selectorType === 'list') {
            elementObj = this.getElementFromListSelector(selectorTitle, elementName);
        }

        expect(await elementObj.getCSSProperty('text-decoration-line')).not.to.equal('line-through');
    }

    async checkOrderOfElements(order, selectorTitle) {
        let orderClass = 'has' + order;
        let element = this.getElementOrderingInSelector(selectorTitle, orderClass);
        await expect(await element.isDisplayed()).toBeTrue();
    }

    async checkForEleOrValueFilterBox(id) {
        let fltr = await this.getElementOrValueFilterUsingId(id);
        await expect(await fltr.isDisplayed()).toBeTrue();
    }

    async checkForNoEleOrValueFilterBox(id) {
        let fltr = await this.getElementOrValueFilterUsingId(id);
        await expect(await fltr.isDisplayed()).toBeFalse();
    }

    async checkForAttrOrMetricsFilterBox(id) {
        const fltr = this.getAttrOrMetricSelectorContainerUsingId(id);
        await expect(await fltr.isDisplayed()).toBeTrue();
    }

    /**
     * Used to select Survey during "Click on elements to select targets" mode, but can be used for other containers.
     * @param {*} targetToSelect xpath to find container that wants to select
     * @param {*} index if there are more than 1 occurences in canvas, 1-index based.
     */
    getTargetInSelectTargetScreenByXPath(targetToSelect, index) {
        return this.$(
            `(${targetToSelect}//ancestor::div[contains(@class,'mstrmojo-UnitContainer') and contains(@class,'targeted')])[${index}]`
        );
    }

    async selectSurveysAsTargets() {
        // no name passed = currently selected selector
        let selector = this.getContainer();
        await this.hoverMouseOnElement(selector);
        let btn = this.getSelectTargetButton();
        await this.click({ elem: btn });
        // will always get first survey found (add id check to make sure it's for survey)
        let target = this.getTargetInSelectTargetScreenByXPath("//iframe[contains(@id,'-iframe')]", 1);
        await this.hoverMouseOnElement(target);
        await this.clickOnElementByInjectingScript(target);
        btn = this.applyButtonFromFilterBoxDialog;
        await this.click({ elem: btn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(7);
    }

    /**
     * Assumed that user already defined dynamic selection and is clickable
     * @param {*} selectorTitle
     */
    async toggleDynamicSelectionIcon(selectorTitle) {
        // hover first before click
        await this.hoverOnVisualizationContainer(selectorTitle);
        await this.click({ elem: this.getDynamicSelectionIconButton(selectorTitle) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    // verify the tooltip's location
    async verifyTooltipLocation(content, selectorName) {
        let tooltipEl = await this.getTooltip(content);
        let tooltipRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', tooltipEl);
        let selectorEl = await this.getContainer(selectorName);
        let selectorRect = await this.getBrowserData('return arguments[0].getBoundingClientRect()', selectorEl);
        let result = tooltipRect.left <= selectorRect.right && tooltipRect.right >= tooltipRect.left;
        await expect(result).to.equal(true);
    }

    async renameSelectorbyDoubleClick(selectorTitle, newName) {
        let titleBar = await this.getVisibleTitleBar(selectorTitle);
        await this.doubleClickOnElement(titleBar);
        await this.clear(titleBar);
        await titleBar.addValue(newName + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragSelectorToCanvas(selectorTitle) {
        let srcel = await this.filterPanel.getSelectorTitleBar(selectorTitle);
        await this.waitForEitherElemmentVisible(srcel);
        let canvas = this.Canvas;
        await this.dragAndDrop({
            fromElem: srcel,
            toElem: canvas,
            toOffset: { x: -30, y: -30 },
        });
    }

    async selectFromLinkBarAttributeMetricSelector(option) {
        let el = this.getOptionFromLinkBarAttributeMetricSelector(option);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async hoverOnEmptyICSByIndex(index) {
        let element = await this.getEmptyElementOrValueFilterUsingId(index);
        await this.hover({ elem: element });
    }

    async createNewParameterFilter() {
        await this.click({ elem: this.inCanvasSelectorButton });
        await this.click({ elem: this.parameterSelector });
        await this.sleep(2000);
    }

    async dragDSObjectToParameterSelector(objectType, objectName, datasetName, filterIdx) {
        const srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectType, datasetName);
        await scrollIntoView(srcel);

        const desel = filterIdx
            ? await this.getParameterSelectorContainerUsingId(parseInt(filterIdx, 10))
            : await this.getContainer();
        const deselSize = await desel.getSize();
        const offsetY = deselSize.height / 3;

        await this.dragAndDrop({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: offsetY },
        });
        await this.sleep(2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragDSObjectAfterSearchToParameterSelector(objectType, objectName, datasetName, filterIdx) {
        let srcel = await this.datasetPanel.getObjectFromDatasetAfterSearch(objectName, objectType, datasetName);
        await this.scrollIntoView(srcel, {
            block: 'nearest',
            inline: 'nearest',
        });
        await srcel.waitForExist();
        await srcel.waitForDisplayed();
        let desel = filterIdx
            ? await this.getParameterSelectorContainerUsingId(parseInt(filterIdx, 10))
            : await this.getContainer();
        await desel.waitForExist();
        await desel.waitForDisplayed();

        const deselSize = await desel.getSize();
        const offsetY = deselSize.height / 3;

        await this.dragAndDrop({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: offsetY },
        });
        await this.sleep(2);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setParameterSelectorInputValueByIndex(idx, value) {
        const inputField = await this.getParameterSelectorContainerInputUsingId(idx);
        await this.click({ elem: inputField });
        await this.clear(inputField);
        await inputField.setValue(value);
        await browser.keys(Key.Enter);
        await this.sleep(3);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setParameterSelectorInputValueByName(name, value) {
        let inputField = await this.getParameterSelectorInputByTitle(name);
        await this.click({ elem: inputField });
        await this.clear(inputField);
        await inputField.setValue(value);
        await browser.keys(Key.Enter);
        await this.sleep(3);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async setParameterSliderSelectorValue(selectorTitle, value) {
        await this.click({ elem: this.getParameterSliderKnob(selectorTitle) });
        let inputBox = this.sliderInputBox;
        await this.click({ elem: inputBox });
        await this.clear(inputBox);
        await inputBox.setValue(value);
        await browser.keys(Key.Enter);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openParameterCalendar(selectorTitle) {
        await this.click({ elem: this.getParameterCalendarIcon(selectorTitle) });
        await this.sleep(3);
    }

    async resetToDefault(selectorTitle) {
        await this.openContextMenu(selectorTitle);
        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.RESET_TO_DEFAULT) });
        await this.sleep(3);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async copyFormatting(selectorTitle) {
        await this.openContextMenu(selectorTitle);
        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.COPY_FORMATTING) });
        await this.sleep(3);
    }

    async pasteFormatting(selectorTitle) {
        await this.openContextMenu(selectorTitle);
        await this.click({ elem: this.filterPanel.getSelectorContextMenuItem(SelectorContextMenu.PASTE_FORMATTING) });
        await this.sleep(3);
    }

    async getSelectedPanelText() {
        return this.getSelectedPanel().getText();
    }
}
