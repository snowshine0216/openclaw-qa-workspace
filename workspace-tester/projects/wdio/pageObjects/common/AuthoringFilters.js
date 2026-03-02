import BasePage from '../base/BasePage.js';
import BaseVisualization from '../base/BaseVisualization.js';
import Dropdown from '../selector/Dropdown.js';
import { scrollIntoView } from '../../utils/scroll.js';
import MetricFilter from '../authoringFilter/MetricFilter.js';
import ParameterFilter from '../authoringFilter/ParameterFilter.js';
import SelectorObject from '../selector/SelectorObject.js';
import { SelectTargetInLayersPanel } from '../authoring/SelectTargetInLayersPanel.ts';
import { FilterPanel } from '../dossierEditor/FilterPanel.js';

export default class AuthoringFilters extends FilterPanel {
    constructor() {
        super();
        this.baseVisualization = new BaseVisualization();
        this.dropdown = new Dropdown();
        this.metricFilter = new MetricFilter();
        this.parameterFilter = new ParameterFilter();
        this.selectorObject = new SelectorObject();
        this.selectTargetInLayersPanel = new SelectTargetInLayersPanel();
    }

    getLoadingDataPopUpDisplayed() {
        return this.$(`//div[contains(@class, 'mstrWaitBox')][contains(@style, 'display: block')]`);
    }

    getLoadingDataPopUpNotDisplayed() {
        return this.$(`//div[contains(@class, 'mstrWaitBox') and contains(@style, 'display: none')]`);
    }

    getFilterPanelMenuIcon() {
        return this.$("//div[contains(@class, 'fp-titlebar')]/div[contains(@class,'fp-menu')]");
    }

    getFilterPanelTab() {
        return this.$("//div[contains(@class, 'flt')]");
    }

    getFilterApplyButton() {
        return this.$('.fp-btnbar .mstrmojo-Button');
    }

    getClickOnOptionInMoreOptionsDropdownMenu(optionName) {
        return this.$(`//a[.//div[contains(text(),'${optionName}')]]`);
    }

    getMoreOptionsDropdownMenu() {
        return this.$("//*[@class='mstrmojo-Button fp-menu']");
    }

    getAttributeMetricFilterCheckbox(attributesMetricsName) {
        return this.$(
            `(//span[@class='text' and normalize-space(text())='${attributesMetricsName}']/ancestor::div[contains(@class, 'item') and not(contains(@class, 'mstrmojo-UnitContainer'))])[last()]`
        );
    }

    getOkButton() {
        return this.$(
            "//div[contains(@class, 'showFilters')]//div[contains(@class, 'mstrmojo-Button-text') and contains(text(), 'OK')]"
        );
    }

    getAttributeMetric(attribute) {
        return this.$$(`//span[text()='${attribute}']`)[0];
    }

    getAttributeMetricOption(attributesMetricsName, attributeMetric) {
        return this.$(
            `//div[@class='item selected' and contains(@aria-label, '${attributesMetricsName}, ${attributeMetric}')]/span[@class='text' and text()='${attributeMetric}']`
        );
    }

    getFilterPanel() {
        return this.$('//div[contains(@class, "mstrmojo-VIFilterPanel")]');
    }

    getFilterHeaders() {
        return this.getFilterPanel().$$('.fp-filter-header');
    }



    getFilterHeaderByName(filterName) {
        return this.getFilterHeaders().filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(filterName);
        })[0];
    }

    getFilterPanelItem(filterName, index = 0) {
        return this.getFilterPanel()
            .$$('.mstrmojo-VIPanel')
            .filter(async (elem) => {
                const elemTitle = elem.$('.mstrmojo-EditableLabel');
                const elemText = await elemTitle.getText();
                return elemText.includes(filterName);
            })[index];
    }

    getFilterPanelItemMenu(filterName, index = 0) {
        return this.getFilterPanelItem(filterName, index).$('.item.mnu');
    }

    getFilterItemWarningIcon(filterName, index = 0) {
        return this.getFilterPanelItem(filterName, index).$('.selectionRequiredWarning');
    }

    getFilterPanelItemGlobalIcon(filterName, index = 0) {
        return this.getFilterPanelItem(filterName, index).$('.dossierLevel');
    }

    getFilterItemTitleBar(fitlerName, index = 0) {
        return this.getFilterPanelItem(fitlerName, index).$('.mstrmojo-VITitleBar');
    }

    getFilterItemSummaryText(filterName, index = 0) {
        return this.getFilterPanelItem(filterName, index).$('.mstrmojo-summary-Label');
    }

    getSelectedItemsInFilterPanel(filterName) {
        return this.getFilterPanelItem(filterName).$$('.item');
    }

    getFilterInfoIcon(filterName) {
        return this.getFilterPanelItem(filterName).$('.filterPortletInfoIcon');
    }

    getFilterLabelName(filterName, index=0) {
        return this.$$(
            '.mstrmojo-VIPanel.mstrmojo-VIPanelPortlet, .mstrmojo-UnitContainer.mstrmojo-UnitContainer-root.mstrmojo-FilterBox'
        ).filter(async (elem) => {
            const elemText = await elem.$('.mstrmojo-EditableLabel').getText();
            return elemText.includes(filterName);
        })[index];
    }

    getFilterContextMenuButton(filterName, index=0) {
        return this.getFilterLabelName(filterName, index).$(
            `.//div[contains(@class, 'mstrmojo-ListBase') and contains(@class, 'mstrmojo-VIToolbar') and contains(@class, 'mstrmojo-VITitleToolbar')]`
        );
    }

    getVisualizationFilterContextMenuButton(filterName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIFilterPanel')]//div[@aria-label='${filterName}' and contains(@class, 'mstrmojo-VITitleBar')]//div[contains(@class, 'mstrmojo-ListBase') and contains(@class, 'mstrmojo-VIToolbar') and contains(@class, 'mstrmojo-VITitleToolbar')]`
        );
    }

    getFilterMenuItemCheckOption(filterName, optionName) {
        return this.getFilterLabelName(filterName)
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(optionName);
            })[0];
    }

    getSelectionRequiredFilterPanelIcon(filterName) {
        return this.$(`//div[@aria-label='${filterName}']//div[@class='selectionRequired']`);
    }

    getSelectionRequiredWarningFilterPanelIcon(filterName) {
        return this.$(`//div[@aria-label='${filterName}']//div[@class='selectionRequiredWarning']`);
    }

    getContextMenuOptionChecked(optionName) {
        return this.$(`//a[contains(@class, 'on mstrmojo-ui-Menu-item')]//div[text()='${optionName}']`);
    }

    getContextMenuOption(optionName) {
        return this.$(`//a[contains(@class, 'mstrmojo-ui-Menu-item')]//div[text()='${optionName}']`);
    }

    getInCanvasItemCheckOption(filterName, optionName) {
        const combinedName = filterName && filterName.length > 0 ? `${filterName}, ${optionName}` : optionName;
        return this.$(`//div[contains(@class, 'mstrmojo-FilterBox')]//div[contains(@aria-label, '${combinedName}')]`);
    }

    getEditorTabButton() {
        return this.$(`//div[text()='Editor']`);
    }

    getFilterContextMenuContainer() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getFilterContextMenuOption(optionName) {
        return this.$(`//a[div[@class='mtxt' and text()='${optionName}']]`);
    }

    getDynamicModeDropdown() {
        return this.$(`//div[contains(@class, 'dynamicSelection')]//div[contains(@class, 'mstrmojo-ui-Pulldown')]`);
    }

    getDynamicSelectionMenu() {
        return this.$(`//div[contains(@class, 'dynamicSelection') and contains(@class, 'mstrmojo-ui-MenuEditor')]`);
    }

    getDynamicModeOption(optionName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-PopupList')]//div[contains(@class, 'item') and contains(text(), '${optionName}')]`
        );
    }

    getDynamicSelectionDropdownList() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-PopupList ctrl-popup-list') and contains (@style, 'display: block')]`
        );
    }

    getDynamicModeQuantityInput() {
        return this.$(`//div[contains(@class, 'dynamicSelection')]//input`);
    }

    getDynamicModeOkButton() {
        return this.$(
            `//div[contains(@class, 'dynamicSelection')]//div[contains(@class, 'mstrmojo-Button') and text()='OK']`
        );
    }

    getAddFilterButton() {
        return this.$(`//div[contains(@class, 'mstrmojo-ListBase')]//div[contains(@class, 'insertFlt')]`);
    }

    getAddFilterOption(optionName) {
        return this.$(
            `//div[contains(@class, 'insertFlt')]//a[contains(@class, 'item')]//div[contains(@class, 'mtxt') and text()='${optionName}']`
        );
    }

    getDatasetElement(itemName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIUnitList')]//div[contains(@class, 'unit')]//span[text()='${itemName}']`
        );
    }

    getEditorElement(elementName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIBoxPanel-content')]//div[contains(@class, 'unit')]//span[text()='${elementName}']`
        );
    }

    getGroupEditorOption(optionName) {
        return this.$(`//div[contains(@class, 'mstrmojo-VIGroupDEElement') and text()='${optionName}']`);
    }

    getGroupEditorOkBtn() {
        return this.$(`//div[contains(@class, 'mstrmojo-Button mstrmojo-Button okBtn')]`);
    }

    getGroupEditorSaveBtn() {
        return this.$(`//div[contains(@class, 'Derived-Elements-Editor-Button saveBtn ')]`);
    }

    getAttributeEditorSuggestion(suggestionName) {
        return this.$(`//div[contains(@class, 'mstrmojo-suggest-text') and text()='${suggestionName}']`);
    }

    getCreatePanelStackButton() {
        return this.$(`//div[contains(@class, 'item btn insertPanelStack')]`);
    }

    getNewInCanvasFilterContainer() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[contains(@class, 'mstrmojo-Label') and text() = 'Drag objects here.']`
        );
    }

    getInCanvasFilterContainer(objectName, idx = 1) {
        return this.$(`(//div[@nm='${objectName}' and contains(@class, 'mstrmojo-DocSelector')])[${idx}]`);
    }

    getInCanvasAncestorContainer(objectName, idx = 1) {
        return this.$(
            `(//div[@nm='${objectName}' and contains(@class, 'mstrmojo-DocSelector')])[${idx}]/ancestor::div[contains(@class, 'mstrmojo-UnitContainer-content')]`
        );
    }

    getInCanvasUnitContainerWithLabel(label) {
        return this.$(`//div[contains(@aria-label, '${label}') and contains(@class, 'mstrmojo-UnitContainer')]`);
    }

    getInCanvasEmptyWarning(filterName) {
        return this.$(
            `//div[contains(@aria-label, '${filterName}') and contains(@class, 'mstrmojo-UnitContainer')]//div[contains(@class, 'mstrmojo-UnitContainer-WarningMessage') and contains(@style, 'display: block')]`
        );
    }

    getSelectTargetFilterButton() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[contains(@class, 'mstrmojo-Button-text') and text() = 'Select Target']`
        );
    }

    getVisualizationTarget(targetName = 'Visualization 1') {
        return this.$(`//span[contains(@class, 'ant-tree-node-content-wrapper')]//span[text() = '${targetName}']`);
    }

    getVisualizationTargetApplyButton() {
        return this.$(`//div[contains(@class, 'filter-box-dialog')]//div[text() = 'Apply']`);
    }

    getVisualizationDragButton(idx = 1) {
        return this.$(`(//div[contains(@class, 'hover-drag-icon-btn')])[${idx}]`);
    }

    getThreeDotsButtonInFilterInCanvas(idx = 1) {
        return this.$(`(//div[contains(@class, 'mstrmojo-FilterBox')]//div[@aria-label='Context Menu'])[${idx}]`);
    }

    getThreeDotsForIcs(filterName) {
        return this.getFilterLabelName(filterName).$(`.hover-btn.hover-menu-btn`);
    }

    getShowOptionForAll() {
        return this.$(`(//span[text() = 'Show option for all']/ancestor::li//div[contains(@class, 'mstr-switch')])[2]`);
    }

    getInCanvasFilteryStyle(filterName, style) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-DocSubPanel-containerNode')]//div[@nm='${filterName}']/ancestor::div[contains(@aria-roledescription, '${style}')]`
        );
    }

    getDynamicModeDisableClearingOption() {
        return this.$(`//div[contains(@class, 'mstrmojo-Label setting-label')]`);
    }

    getTooltipContent() {
        return this.$(`//div[contains(@style, 'ity: visible')]//div[contains(@class, 'mstrmojo-Tooltip-content ')]`);
    }

    getInCanvasSearchBoxDeleteButton(optionName) {
        return this.$(
            `//div[contains(@aria-label, "${optionName}") and @class='elem']//div[contains(@class, 'mstrmojo-SimpleObjectInputBox-del')]`
        );
    }

    getInCanvasDropdownBox(filterName) {
        return this.$(
            `//div[contains(@nm, "${filterName}") and @class='mstrmojo-DocSelector vi-DocSelector']//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getInCanvasDropdownOption(optionName) {
        return this.dropdown
            .getDropdownList()
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(optionName);
            })[0];
    }

    getInCanvasDropdownOkButton(idx = 1) {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ui-PopupWidget')]//div[@class='mstrmojo-Button-text ' and text()='OK'])[${idx}]`
        );
    }

    getDropdownOkButton() {
        return this.$('.mstrmojo-ui-CheckList, .mstrmojo-PopupList')
            .$$('.mstrmojo-Button')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === 'OK';
            })[0];
    }

    getButtonWithName(buttonName) {
        return this.$(`//div[@class='mstrmojo-Button-text ' and text()='${buttonName}']`);
    }

    getCandidateDropdown() {
        return this.$(
            `//div[contains(@class, 'candidate-picker')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]//div[contains(@class, 'candidate-picker')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getFilterPanelDropdown(filterName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIPanelPortlet')]//div[@nm='${filterName}']//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getInCanvasDropdown(filterName) {
        return this.getFilterLabelName(filterName).$('.mstrmojo-ui-Pulldown-text');
    }

    getInCanvasSliderText(filterName) {
        return this.$(
            `//div[@nm='${filterName}']//div[contains(@class, 'sl-control')]//div[contains(@class, 'mstrmojo-Label')]`
        );
    }

    getSearchBoxItemSelected(filterName, optionName) {
        return this.$(`//div[@nm='${filterName}']//div[contains(@title, '${optionName}')]`);
    }

    getFilterMenuDropdownText(filterName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIPanelPortlet')]//div[@nm='${filterName}']//div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    getInCanvasSearchBoxElement(filterElementName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-FilterBox')]//div[contains(@aria-label, '${filterElementName}')]`
        );
    }

    getSearchBoxEmptyWarningText(filterName) {
        return this.$(
            `//div[contains(@aria-label, '${filterName}') and contains(@class, 'mstrmojo-UnitContainer')]//div[contains(@class, 'empty-text-wrapper')]`
        );
    }

    getStandardFilterContainerWarningText(filterName) {
        return this.$(
            `//div[contains(@aria-label, '${filterName}') and contains(@class, 'mstrmojo-UnitContainer')]//div[contains(@class, 'mstrmojo-UnitContainer-WarningMessage') and contains(@style, 'display: block')]`
        );
    }

    getFilterHeader(elementName) {
        return this.$(`//div[contains(@class, 'mstrmojo-EditableLabel') and contains(text(), '${elementName}')]`);
    }

    getFilterPanelWarning() {
        return this.$('.mstrmojo-Label.subtitle.warning');
    }

    async hoverFilterPanelWarning() {
        await this.hover({ elem: this.getFilterPanelWarning() });
    }

    async moveFilterToCanvas(elementName, visualizationTitle) {
        const filterHeaderLocation = await this.getFilterHeader(elementName).getLocation();
        const visualizationTitleLocation = await this.baseVisualization.getTitleBox(visualizationTitle).getLocation();
        await this.dragAndDropPixelByPixel(filterHeaderLocation, visualizationTitleLocation);
        await this.waitForCurtainDisappear();
        await browser.pause(2000);
    }

    async createDossierAndImportSampleFiles(sampleFileIdx = 0) {
        const { libraryAuthoringPage, datasetsPanel, libraryPage } = browsers.pageObj1;
        await libraryPage.openDefaultApp();
        await libraryAuthoringPage.createDossierFromLibrary();
        await datasetsPanel.clickNewDataBtn(); // Using Sample Files as data source
        await this.waitForElementVisible(datasetsPanel.getDataSourceByIndex(5), {
            timeout: 20000,
            msg: 'New data wait too long',
        });
        await datasetsPanel.clickDataSourceByIndex(5); // Using Sample Files as data source
        await datasetsPanel.importSampleFiles([sampleFileIdx]); // airline
        await this.waitForCurtainDisappear();
    }
    async waitLoadingDataPopUpIsNotDisplayed() {
        await this.waitForElementInvisible(this.getLoadingDataPopUpDisplayed());
        await this.waitForElementExsiting(this.getLoadingDataPopUpNotDisplayed());
        // Allow fraction for animation
        await this.sleep(200);
    }

    async createBasicCustomGroup(attributeName, groupElement) {
        const editorElement = await this.getEditorElement(attributeName);
        await this.rightClick({ elem: editorElement });
        await this.click({ elem: this.getFilterContextMenuOption('Create Groups...') });
        await (await this.getGroupEditorOption(groupElement)).doubleClick();
        await this.click({ elem: this.getGroupEditorOkBtn() });
        await this.click({ elem: this.getGroupEditorSaveBtn() });
    }

    /** open filter panel context menu by using the icon
     */
    async switchToFilterPanel() {
        const filterPanelTab = await this.getFilterPanelTab();
        await this.waitForElementVisible(filterPanelTab);
        await this.click({ elem: filterPanelTab });
    }

    async changeShowOptionForAll() {
        await this.click({ elem: this.getShowOptionForAll() });
    }

    async addFilterToFilterPanel(attributesMetricsName) {
        await this.clickAndNoWait({ elem: this.getFilterPanelTab() });
        await this.clickAndNoWait({ elem: this.getFilterPanelMenuIcon() });
        await this.clickAndNoWait({ elem: this.getClickOnOptionInMoreOptionsDropdownMenu('Add Filters') });
        await this.clickAndNoWait({ elem: this.getAttributeMetricFilterCheckbox(attributesMetricsName) });
        await this.click({ elem: this.getOkButton() });
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openFilterContextMenu(filterName) {
        await this.click({ elem: this.getFilterContextMenuButton(filterName) });
    }

    async clickFilterContextMenuOption(filterName, contextMenuOptions) {
        await this.hover({ elem: this.getFilterContextMenuButton(filterName) });
        let contentMenuDisplayed = await this.getFilterContextMenuContainer().isDisplayed();
        for (let i = 0; i < 5; i++) {
            if (!contentMenuDisplayed) {
                await this.click({ elem: this.getFilterContextMenuButton(filterName) });
                contentMenuDisplayed = await this.getFilterContextMenuContainer().isDisplayed();
            }
        }
        for (const contextMenuOption of contextMenuOptions) {
            await this.click({ elem: this.getFilterContextMenuOption(contextMenuOption) });
            await this.sleep(500);
        }
        await this.waitLoadingDataPopUpIsNotDisplayed();
        await this.waitForCurtainDisappear();
    }

    async clickDisplayStyleOption(optionName) {
        await this.click({ elem: this.getFilterContextMenuOption(optionName) });
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectDisplayStyleForFilterItem(filterName, displayStyle) {
        await this.openFilterContextMenu(filterName);
        await this.waitForElementExsiting(this.getFilterContextMenuOption('Display Style'));
        await this.click({ elem: this.getFilterContextMenuOption('Display Style') });
        await this.waitForElementExsiting(this.getFilterContextMenuOption('Display Style'));
        await this.clickDisplayStyleOption(displayStyle);
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectDisplayStyleForInCanvasItem(filterName, dragButtonIdx, inCanvasContainerIdx, displayStyle) {
        await this.clickAndNoWait({ elem: this.getVisualizationTarget(filterName) });
        await this.clickAndNoWait({ elem: this.getVisualizationDragButton(dragButtonIdx) });

        await this.clickAndNoWait({ elem: this.getThreeDotsButtonInFilterInCanvas(inCanvasContainerIdx) });
        await this.click({ elem: this.getFilterContextMenuOption('Display Style') });

        await this.clickDisplayStyleOption(displayStyle);
        await this.waitForCurtainDisappear();
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectDynamicSelectionMode(filterName, mode, quantity, index=0) {
        await this.click({ elem: this.getFilterContextMenuButton(filterName, index) });
        await this.click({ elem: this.getFilterContextMenuOption('Dynamic Selection') });
        await this.click({ elem: this.getDynamicModeDropdown() });
        await this.click({ elem: this.getDynamicModeOption(mode) });
        await this.click({ elem: this.getDynamicModeQuantityInput() });
        await browser.keys(['Backspace']);
        await this.getDynamicModeQuantityInput().setValue(quantity);
        await this.click({ elem: this.getDynamicModeOkButton() });
    }

    async selectFilterPanelFilterCheckboxOption(filterName, optionName) {
        await this.click({ elem: this.getFilterMenuItemCheckOption(filterName, optionName) });
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectInCanvasFilterCheckboxOption(filterName, optionName) {
        await this.click({ elem: this.getInCanvasItemCheckOption(filterName, optionName) });
    }

    async createInCanvasFilter(objectName) {
        await this.click({ elem: this.getAddFilterButton() });
        await this.click({ elem: this.getAddFilterOption('Element / Value Filter') });

        await this.waitForElementClickable(this.getDatasetElement(objectName));
        await this.click({ elem: this.getDatasetElement(objectName) });

        await this.dragMoveAndDrop(this.getDatasetElement(objectName), this.getNewInCanvasFilterContainer());
        await this.click({ elem: this.getSelectTargetFilterButton() });
        await this.click({ elem: this.getVisualizationTarget('Visualization 1') });
        await this.click({ elem: this.getVisualizationTargetApplyButton() });
    }

    async createSimpleObjectSelector(attrName) {
        const { datasetsPanel } = browsers.pageObj1;

        await this.click({ elem: this.getAddFilterButton() });
        await this.click({ elem: this.getAddFilterOption('Attribute / Metric Selector') });

        await this.waitLoadingDataPopUpIsNotDisplayed();
        await datasetsPanel.doubleClickAttributeMetric(attrName);
        await this.click({ elem: this.getSelectTargetFilterButton() });

        await this.click({ elem: this.getVisualizationTarget('Visualization 1') });

        await this.click({ elem: this.getVisualizationTargetApplyButton() });
    }

    async createSimpleObjectSelectorWithReplacement({ objectName, replacementName }) {
        await this.createSimpleObjectSelector(objectName);
        await this.selectTargetInLayersPanel.objectToReplace(replacementName);
        await this.selectTargetInLayersPanel.applyButtonForSelectTarget();
        await this.waitForCurtainDisappear();
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectInCanvasContextOption(objectName, optionName, waitForLoadingAfter = true) {
        const item = this.getFilterLabelName(objectName);
        await this.click({ elem: item });
        await this.click({ elem: this.getThreeDotsForIcs(objectName) });
        await this.click({ elem: this.getFilterContextMenuOption(optionName) });
        if (waitForLoadingAfter) {
            await this.waitLoadingDataPopUpIsNotDisplayed();
            await browser.pause(500);
        }
    }

    async selectInCanvasDynamicSelectionMode(objectName, mode, quantity, idx) {
        await this.waitForElementClickable(this.getInCanvasFilterContainer(objectName, 1));
        await this.click({ elem: this.getInCanvasFilterContainer(objectName, 1) });
        await this.click({ elem: this.getThreeDotsButtonInFilterInCanvas(idx) });
        await this.click({ elem: this.getFilterContextMenuOption('Dynamic Selection') });
        await this.click({ elem: this.getDynamicModeDropdown() });
        await this.click({ elem: this.getDynamicModeOption(mode) });
        await this.click({ elem: this.getDynamicModeQuantityInput() });
        await browser.keys(['Backspace']);
        await this.getDynamicModeQuantityInput().setValue(quantity);
        await this.click({ elem: this.getDynamicModeOkButton() });
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectFilterPanelOptionByDisplayStyle(displayStyle, filterName, optionName, idx = 1) {
        let { rsdPage } = browsers.pageObj1;

        switch (displayStyle) {
            case 'Drop-down':
                await this.click({ elem: this.getFilterPanelDropdown(filterName) });
                await this.click({ elem: this.getInCanvasDropdownOption(optionName) });
                await this.click({ elem: this.getDropdownOkButton() });
                return;
            case 'Search Box':
                const selectorFound = await rsdPage.findSelectorByName(filterName);
                return await selectorFound.searchbox.deleteItemByText(optionName);
            default:
                return await this.click({ elem: this.getFilterMenuItemCheckOption(filterName, optionName) });
        }
    }

    async selectInCanvasPanelFilterCheckboxOptionByDisplayStyle(displayStyle, filterName, optionName, extra) {
        let { selector } = browsers.pageObj1;

        switch (displayStyle) {
            case 'Drop-down':
                await this.click({ elem: this.getInCanvasDropdown(filterName) });
                await this.click({ elem: this.getInCanvasDropdownOption(optionName) });

                if (extra.isMultiDropdown) {
                    await this.click({ elem: this.getInCanvasDropdownOkButton(extra.idx) });
                }
                return;
            case 'Search Box':
                await selector.searchbox.input(optionName);
                return await selector.searchbox.selectItemByText(optionName);
            default:
                return await this.selectInCanvasFilterCheckboxOption(filterName, optionName);
        }
    }

    async setFilterToSelectorContainer(filterName, index) {
        const selector = SelectorObject.createByName(filterName);
        const filter = this.getFilterPanelItem(filterName, index);
        const searchbox = selector.searchbox;
        await searchbox.setContainer(filter);
        this.selectorObject = selector;
    }

    setFilterToAQSelectorContainer(filterName, index) {
        const selector = new SelectorObject();
        const filter = this.getFilterPanelItem(filterName, index);
        const calendar = selector.calendar;
        const mq = selector.metricQualification;
        const checkbox = selector.checkbox;
        const slider = selector.slider;
        const radioButton = selector.radiobutton;
        const dropdown = selector.dropdown;
        calendar.setContainer(filter);
        mq.setContainer(filter);
        checkbox.setContainer(filter);
        slider.setContainer(filter);
        radioButton.setContainer(filter);
        dropdown.setContainer(filter);
        this.selectorObject = selector;
    }

    async checkSearchBoxItemSelected(filterName, optionName) {
        const exists = await this.getSearchBoxItemSelected(filterName, optionName).isExisting();
        return exists.toString();
    }
    async checkFilterMenuItemSelectedByDisplayStyle(displayStyle, filterName, optionName) {
        switch (displayStyle) {
            case 'Drop-down':
                const element = this.getFilterMenuDropdownText(filterName);

                return await (await element.getText()).includes(optionName).toString();

            case 'Search Box':
                return await this.checkSearchBoxItemSelected(filterName, optionName);
            case 'Slider':
                const sliderText = await this.getInCanvasSliderText(filterName).getText();
                return sliderText.includes(optionName).toString();

            default:
                return await this.getFilterMenuItemCheckOption(filterName, optionName).getAttribute('aria-checked');
        }
    }

    async addVisualizationFilterToFilterPanel(usedObjectName) {
        const { datasetsPanel } = browsers.pageObj1;
        await this.click({ elem: this.getFilterPanelMenuIcon() });
        await this.click({ elem: this.getFilterContextMenuOption('Add Visualization Filter...') });
        await this.waitLoadingDataPopUpIsNotDisplayed();
        await datasetsPanel.doubleClickAttributeMetric(usedObjectName);
        await this.click({ elem: this.getButtonWithName('Done') });
        await this.waitLoadingDataPopUpIsNotDisplayed();
    }

    async createPanelStack() {
        // First create panel stack filter
        await this.click({ elem: this.getAddFilterButton() });
        await this.click({ elem: this.getAddFilterOption('Panel Selector') });
        // Then create panel stack
        await this.click({ elem: this.getCreatePanelStackButton() });
        // select target
        await this.click({ elem: this.getSelectTargetFilterButton() });

        await this.click({ elem: this.getVisualizationTarget('Panel Stack 1') });
        await this.click({ elem: this.getVisualizationTargetApplyButton() });
    }

    async getInCanvasEmptyWarningByDisplayStyle(
        displayStyle,
        filterName,
        expectedEmptyText = 'Make at least one selection.'
    ) {
        switch (displayStyle) {
            case 'Search Box':
                const retrievedText = await this.getSearchBoxEmptyWarningText(filterName).getText();
                return retrievedText === expectedEmptyText;
            default:
                return await this.getStandardFilterContainerWarningText(filterName).isExisting();
        }
    }

    async getInCanvasElementSelectedByDisplayStyle(displayStyle, filterName, filterElementName) {
        const getInCanvasSelectedByStyle = (displayStyle) => {
            switch (displayStyle) {
                case 'Radio Buttons':
                case 'Check Boxes':
                    return 'aria-checked';
                default:
                    return 'aria-selected';
            }
        };

        // get missing pages requirements from below
        const checkLabel = getInCanvasSelectedByStyle(displayStyle);
        switch (displayStyle) {
            case 'Drop-down':
                const elementSearched = await this.getInCanvasDropdownBox(filterName);
                if (await !elementSearched.isExisting()) {
                    return 'false';
                }
                return await (await this.getInCanvasDropdownBox(filterName).getAttribute('aria-label'))
                    .includes(filterElementName)
                    .toString();
            case 'Search Box':
                const searchboxExists = await this.getInCanvasSearchBoxElement(filterElementName).isExisting();

                return searchboxExists.toString();
            case 'Slider':
                const sliderText = await this.getInCanvasSliderText(filterName).getText();
                return sliderText.includes(filterElementName).toString();

            default:
                return await this.getInCanvasItemCheckOption(filterName, filterElementName).getAttribute(checkLabel);
        }
    }

    checkElementByType(type) {
        const { checkboxFilter, filterElement, searchBoxFilter, attributeSlider } = browsers.pageObj1;
        switch (type) {
            case 'Check Boxes':
                return checkboxFilter.isElementSelected.bind(checkboxFilter);
            case 'Radio Buttons':
                return filterElement.isRadioButtonSelected.bind(filterElement);
            case 'Search Box':
                return searchBoxFilter.isElementSelected.bind(searchBoxFilter);
            case 'Slider':
                return async (optionName, filterName, afterReset) => {
                    const summary = await attributeSlider.summary(filterName);

                    if (afterReset) {
                        return summary.length === 0;
                    }

                    return await summary.includes(optionName);
                };
            default:
                return checkboxFilter.isElementSelected.bind(checkboxFilter);
        }
    }

    // Consumption mode
    async selectItemOptionByDisplayStyle(displayStyle, name, extra = {}) {
        const { dynamicFilter, filterElement, attributeSlider } = browsers.pageObj1;
        switch (displayStyle) {
            case 'Search Box':
                await browser.pause(500);

                await this.click({ elem: dynamicFilter.getFilterSearchBox() });

                await browser.pause(500);
                (await dynamicFilter.getFilterSearchBox()).clearValue();
                await browser.pause(500);

                await filterElement.typeKeyboard(extra.searchWord || name);
                await this.click({ elem: filterElement.getSearchElementByName(name) });
                await browser.pause(500);
                return;
            case 'Slider':
                await browser.pause(5000);
                await attributeSlider.dragAndDropLowerHandle(extra.filterObjectName, extra.sliderOffset);
                await browser.pause(500);
                return;
            default:
                await this.click({ elem: filterElement.getElementByName(name) });
                await browser.pause(500);
                return;
        }
    }

    async removeInCanvasElementByDisplayStyle(displayStyle, filterObject, elementName, idx = 2) {
        switch (displayStyle) {
            case 'Search Box':
                await this.click({
                    elem: this.getInCanvasSearchBoxDeleteButton(elementName),
                });
                await this.waitForCurtainDisappear();
                return;
            case 'Drop-down':
                await this.click({ elem: this.getInCanvasDropdownBox(filterObject.name) });
                await this.click({ elem: this.getInCanvasDropdownOption(elementName) });
                await this.click({ elem: this.getInCanvasDropdownOkButton(idx) });
                await this.waitForCurtainDisappear();
                return;

            default:
                await this.click({ elem: this.getInCanvasItemCheckOption(filterObject.name, elementName) });
                await this.waitForCurtainDisappear();

                return;
        }
    }

    async selectFiltersOption(optionName) {
        await this.click({ elem: this.getMoreOptionsDropdownMenu() });
        await this.click({ elem: this.getFilterContextMenuOption(optionName) });
        await this.waitForCurtainDisappear();
    }

    // Dynamic selection
    getDynamicIcon(filterName) {
        return this.getFilterLabelName(filterName).$('.dynamicSelection.off, .off.dynamicSelection');
    }

    getDynamicOnIcon(filterName) {
        return this.getFilterLabelName(filterName).$('.dynamicSelection.on, .on.dynamicSelection');
    }

    async changeToDynamicSelection(filterName) {
        await this.hover({ elem: this.getFilterLabelName(filterName) });
        await this.click({ elem: this.getDynamicIcon(filterName) });
    }

    // url generator
    async selectFilterItem(filterName) {
        await this.click({ elem: this.getFilterLabelName(filterName).$('.mstrmojo-generate-url-indicator.mask') });
    }

    async selectFilterItems(nameList) {
        for (let name of nameList) {
            await this.selectFilterItem(name);
        }
    }

    getDynamicButton(filterName) {
        return this.getFilterLabelName(filterName).$('.dynamicButton');
    }

    async clickDynamicButton(filterName) {
        return this.click({ elem: this.getDynamicButton(filterName) });
    }

    async clickDynamicButtons(nameList) {
        for (let name of nameList) {
            await this.hover({ elem: this.getFilterLabelName(name) });
            await this.clickDynamicButton(name);
        }
    }

    async isDynamicButtonPresent(filterName) {
        return this.getDynamicButton(filterName).isDisplayed();
    }

    async isDynamicButtonEnabled(filterName) {
        return this.getDynamicButton(filterName).isEnabled();
    }

    async getDescriptionTooltipText(filterName) {
        await scrollIntoView(this.getFilterPanelItem(filterName));
        await this.hover({ elem: this.getMoreOptionsDropdownMenu() });
        await this.waitForElementInvisible(this.getTooltipContent());
        await this.hover({ elem: this.getFilterInfoIcon(filterName) });
        await this.waitForElementVisible(this.getTooltipContent());
        const value = await this.getTooltipContent().getText();
        return this.getTooltipContent().getText();
    }

    async isFilterInfoIconDisplayed(filterName) {
        await scrollIntoView(this.getFilterPanelItem(filterName));
        const value = await this.getFilterInfoIcon(filterName).isDisplayed();
        return this.getFilterInfoIcon(filterName).isDisplayed();
    }

    async isScopeFilterDisplayed() {
        return this.getFilterHeaderByName('Scope Filters').isDisplayed();
    }

    async isDashboardFilterDisplayed() {
        return this.getFilterHeaderByName('Dashboard Filters').isDisplayed();
    }

    async getScopeFilterInfoMessage() {
        const el = this.getFilterHeaderByName('Scope Filters').$('.infoIcon');
        await this.hover({ elem: el });
        await this.waitForElementVisible(this.getTooltipContent());
        return this.getTooltipContent().getText();
    }

    async getFilterWarningMessage(filterName, index = 0) {
        const el = this.getFilterItemWarningIcon(filterName, index);
        await this.hover({ elem: el });
        await this.waitForElementVisible(this.getTooltipContent());
        return this.getTooltipContent().getText();
    }

    async collapseFilter(filterName, index = 0) {
        const item = this.getFilterPanelItem(filterName, index);
        await scrollIntoView(item);
        const titleBar = this.getFilterItemTitleBar(filterName, index);
        const el = titleBar.$('.left-toolbar .mstrmojo-Image')
        let isCollapsed = await this.isCollapsed(titleBar);
        if (!isCollapsed) {
            await this.click({ elem: el });
        }
    }

    async expandFilter(filterName, index = 0) {
        const item = this.getFilterPanelItem(filterName, index);
        await scrollIntoView(item);
        const titleBar = this.getFilterItemTitleBar(filterName, index);
        const el = titleBar.$('.left-toolbar .mstrmojo-Image')
        const isCollapsed = await this.isCollapsed(titleBar);
        if (isCollapsed) {
            await this.click({ elem: el });
        }
        await this.waitForCurtainDisappear();
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }

    async getFilterSummary(filterName, index = 0) {
        return this.getFilterItemSummaryText(filterName, index).getText();
    }

    async isFilterItemMenuDisplayed(filterName, index = 0) {
        return this.getFilterContextMenuButton(filterName, index).isDisplayed();
    }

    async isFilterItemGlobalIconDisplayed(filterName, index = 0) {
        return this.getFilterPanelItemGlobalIcon(filterName, index).isDisplayed();
    }

    async isFilterItemMandatoryIconDisplayed(filterName) {
        return this.getSelectionRequiredFilterPanelIcon(filterName).isDisplayed();
    }

    async isFilterOptionDisplayed(optionName) {
        await this.click({ elem: this.getMoreOptionsDropdownMenu() });
        return this.getFilterContextMenuOption(optionName).isDisplayed();
    }

    async applyFilter() {
        await this.click({elem: this.getFilterApplyButton()});
        await this.waitForCurtainDisappear();
    }

}
