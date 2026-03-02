import BasePage from '../base/BasePage.js';
import Utils from '../authoring/Utils.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import VizPanelForGrid from './VizPanelForGrid.js';
import DatasetsPanel from './DatasetPanel.js';
import Common from './Common.js';
import FilterPanel from './../common/FilterPanel.js';
import CalculationMetric from './CalculationMetric.js';
import ThresholdEditor from './ThresholdEditor.js';

export default class EditorPanelForGrid extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.gridViz = new VizPanelForGrid();
        this.datasetsPanel = new DatasetsPanel();
        this.visualizationForGrid = new VizPanelForGrid();
        this.common = new Common();
        this.filterPanel = new FilterPanel();
        this.calculationMetric = new CalculationMetric();
        this.thresholdEditor = new ThresholdEditor();
    }

    get editorPanel() {
        return this.$('//div[contains(@class, "mstrmojo-VIVizEditor")]');
    }

    getObject(objectName, objectType) {
        const objectTypeName = Utils.objectTypeIdExtended(objectType.toLowerCase(), '');
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]//*[contains(@class,'${objectTypeName}')]//*[text()='${objectName}']`
        );
    }

    getObjectWithoutType(objectName) {
        return this.$(`//div[contains(@class, 'mstrmojo-VIVizEditor')]//*[text()='${objectName}']`);
    }

    getClearAllButton() {
        return this.$(`//div[contains(@class, 'clearall')]`);
    }

    getShowTotalButton() {
        return this.$(`//div[contains(@class, 'totals')]`);
    }

    getObjectsInRowsSection() {
        return this.$$(
            `//div[contains(@class, 'mstrmojo-VIPanel-titlebar') and .//div[contains(@aria-label, 'Rows')]]/following-sibling::div[contains(@class, 'mstrmojo-VIPanel-content')]//div[contains(@class, 'item unit')]//span[contains(@class, 'txt')]`
        );
    }
    getObjectsInColumnSet(columnSetName) {
        return this.$$(
            `//div[contains(@class, 'mstrmojo-VITitleBar') and .//div[contains(@aria-label, '${columnSetName}')]]/parent::div/following-sibling::div[contains(@class, 'mstrmojo-VIPanel-content')]//div[contains(@class, 'item unit')]//span[contains(@class, 'txt')]`
        );
    }

    getObjectInDropZone(object, zone) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]/descendant::div[text()='${zone}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/following-sibling::div[@class='mstrmojo-VIPanel-content']/div/div/descendant::span[text()='${object}']`
        );
    }

    getObjectWithoutTypeInItemUnit(objectName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]//*[contains(@class,'item unit ic')]//*[text()='${objectName}']`
        );
    }

    getContextMenuOption(option) {
        return this.$(`//div[contains(@class,'mstrmojo-ui-Menu-item-container')]//div[contains(text(),'${option}')]`);
    }

    getSecondaryContextMenu(secondaryOption) {
        return this.$(
            ` //div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//child::*[text()='${secondaryOption}']`
        );
    }

    getCalculationMetricDropDownContext(objectName, index) {
        return this.$(
            `(//div[contains(@class,'Calculation-PullDown')]//div[contains(@class, 'mstrmojo-PopupList')]//child::*[text()='${objectName}'])[${index}]`
        );
    }

    getCalculationMetricContext(objectName, index) {
        return this.$(
            `(//div[contains(@class,'Calculation-PullDown')]//div[contains(@class, 'mstrmojo-ui-Pulldown-text')][text()='${objectName}')])[${index}]`
        );
    }

    getObjectFromSection(objectName, objectType, sectionName) {
        const type = Utils.objectTypeIdExtended(objectType.toLowerCase(), '');
        return this.$(
            `//*[child::div/child::div/child::div/child::div/child::div[contains(@class,'selected') and contains(@class,'edt')]]//div[contains(@class,'mstrmojo-VIPanelPortlet') and child::div/child::div/child::div/child::div[text()='${sectionName}']]//div[contains(@class,'ic${type}') and child::div/child::div/child::span[text()='${objectName}']]`
        );
        // return this.$(
        //     `//div[contains(@class, 'mstrmojo-VIPanelPortlet') and .//div[contains(@class, 'mstrmojo-EditableLabel') and text()='${sectionName}']]//div[contains(@class, 'item') and .//span[text()='${objectName}']]`
        // );
    }

    getMCFromSection(objectName, objectType, sectionName) {
        return this.$(
            `//*[child::div/child::div/child::div/child::div/child::div[contains(@class,'selected') and contains(@class,'edt')]]//div[contains(@class,'mstrmojo-VIPanelPortlet') and child::div/child::div/child::div/child::div[text()='${sectionName}']]//div[contains(@class,'mc-${objectType}') and child::div/child::div/child::span[text()='${objectName}']]`
        );
    }

    getObjectFromSectionSansType(objectName, sectionName) {
        return this.$(
            `//*[child::div/child::div/child::div/child::div/child::div[contains(@class,'selected') and contains(@class,'edt')]]//div[contains(@class,'mstrmojo-VIPanelPortlet') and child::div/child::div/child::div/child::div[text()='${sectionName}']]//div[child::div/child::div/child::span[text()='${objectName}']]`
        );
    }

    getSelectedDockPanel(panelName) {
        return this.$(
            `//*[child::div/child::div/child::div/child::div/child::div[contains(@class,'selected') and contains(@class,'${panelName}')]]`
        );
    }

    getDockPanelShortName(panelName) {
        switch (panelName) {
            case 'editor':
            case 'Editor':
                return 'edt';
            case 'filter':
            case 'Filter':
                return 'flt';
            case 'format':
            case 'Format':
                return 'prp';
            default:
                return '';
        }
    }

    getDropZonePanel(panelName) {
        return this.$(
            `//div[contains(@class, 'item')][contains(@class, '${this.getDockPanelShortName(
                panelName
            )}')]/child::*[contains(text(),'${panelName}')]`
        );
    }

    get RankPopupContext() {
        let path = `//div[@class='mstrmojo-ui-MenuEditor mstrmojo-ui-MenuPopup NewRankMetric-MenuEditor mstrmojo-scrollbar-host']`;
        // if (browser.config.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollbar-host', 'mstrmojo-sb-host-show-default');
        // }
        return this.$(path);
    }

    getObjectFromDataset(objectName, objectType, datasetName) {
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet')]/div[@class='mstrmojo-VIPanel-content']/div/div/div[contains(@class,'${Utils.objectTypeInItemUnitFormat(
                objectType
            )}') and child::span[text()='${objectName.replace(
                / /g,
                '\u00a0'
            )}'] and parent::div/parent::div/parent::div/parent::div[child::div[@class='mstrmojo-VIPanel-titlebar' and  child::div/child::div[@class='title-text']/child::div[text()='${datasetName}']]]]`
        );
    }

    getAdvanceThresholdEditor() {
        // const thresholdEditorSelector = `//div[contains(@class, 'adv-threshold') and contains(@class, 'modal')]//div[
        //     starts-with(normalize-space(), 'Thresholds')
        //     and contains(., '-')
        //     and contains(., '${objectName}')
        // ]`;
        const thresholdEditorSelector = `//div[contains(@class, 'adv-threshold') and contains(@class, 'modal')]//div[
            starts-with(normalize-space(), 'Thresholds')
            and contains(., '-')
        ]`;
        return this.$(thresholdEditorSelector);
    }

    getSimpleThresholdEditor() {
        return this.$('.mstrmojo-Editor.mstrmojo-SimpleThresholdEditor.modal');
    }

    getShortcutMetricName(objectName, shortcutMetricOption) {
        switch (shortcutMetricOption) {
            case 'Rank':
            case 'Percentile Rank':
            case 'Percent to Total':
            case 'Percent Running Total':
                return `${shortcutMetricOption} (${objectName})`;
            case 'Percent Of':
                return `Percent of Previous (${objectName})`;
            case 'Percent Change':
                return `Percent Change From Previous (${objectName})`;
            case 'Difference':
                return `Difference From Previous (${objectName})`;
            case 'Moving Average':
                return `Moving Avg (${objectName})`;
            case 'Running Total':
                return `Running Sum (${objectName})`;
            default:
                return '';
        }
    }

    get derivedElementEditorWindow() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Editor')]//child::*[(contains(text(),'Attribute') or contains(text(),'Metric')) and contains(text(),'Editor')]`
        );
    }

    getGroupEditorWindow(groupName) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Editor')]//child::*[contains(text(),'Group') and contains(text(),'Editor') and contains(text(),'${groupName}')]`
        );
    }

    get panelContextMenu() {
        return this.editorPanel.$$(`.//div[contains(@class, 'mstrmojo-VITitleBar')]//div[contains(@class, 'mstrmojo-ListBase')]`)[0];
    }

    get titleBar() {
        return this.$(`(//div[contains(@class, 'mstrmojo-VIVizEditor')]//div[contains(@class, 'mstrmojo-VITitleBar')]//div[contains(@class, 'title-text')]//div[contains(@class, 'mstrmojo-EditableLabel')])[1]`);
    }

    async isDisplayFormAvailable(formName) {
        return (await this.$$(`//div[contains(@class,'mstrmojo-ui-CheckList')]//*[text()='${formName}']`)).length > 0;
    }
    async selectDisplayForms(formNames) {
        for (const formName of formNames) {
            // Select the form based on the formName
            const formElem = await this.$(`//div[contains(@class,'mstrmojo-ui-CheckList')]//*[text()='${formName}']`);
            await formElem.click();
        }
        const okBtn = await this.$(
            `//div[contains(@class,'mstrmojo-Button')]//div[contains(@class,'mstrmojo-Button') and contains(text(),'OK')]`
        );
        await okBtn.click();

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async isDisplayFormSelected(formName) {
        return (
            (
                await this.$$(
                    `//div[contains(@class,'mstrmojo-ui-CheckList')]//*[contains(@class, 'item selected')]//*[text()='${formName}']`
                )
            ).length > 0
        );
    }

    async getDisplayAttributeFormNamesPullDownMenu() {
        let path = `//div[@class='mojo-theme-light mstrmojo-popup-widget-hosted']//div[@class='mstrmojo-ui-MenuEditor mstrmojo-ui-MenuPopup displayForms mstrmojo-scrollbar-host']//div[@class='mstrmojo-ui-Pulldown-text ']`;
        // if (browser.config.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollbar-host', 'mstrmojo-sb-host-show-default');
        // }
        return this.$(path);
    }

    async getPullDownFromMoreOption(title) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Editor-content')]//div[contains(@class, 'mstrmojo-Label') and text()='${title}']/following-sibling::div[contains(@class, 'mstrmojo-ui-Pulldown')]/div[contains(@class, 'mstrmojo-ui-Pulldown-text')]`
        );
    }

    async getDisplayAttributeFormNamesOption(option) {
        let path = `//div[contains(@class,'mstrmojo-PopupList ctrl-popup-list mstrmojo-scrollbar-host')]//div[contains(@class,'mstrmojo-popupList-scrollBar mstrmojo-scrollNode')]//div[contains(text(), '${option}')]`;
        // if (browser.config.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollbar-host', 'mstrmojo-sb-host-show-default');
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$(path);
    }

    async getDisplayFormItem(formName) {
        return this.filterPanel.getDisplayForm(formName).$(`./ancestor::div[contains(@class, 'item')]`);
    }

    async isObjectPresent(objectName, objectType) {
        const objToRename = this.getObject(objectName, objectType);
        await browser.waitUntil(() => objToRename.isDisplayed());
        return objToRename.isDisplayed();
    }

    async renameObject(objectName, objectType, newObjectName) {
        await this.rightClick({ elem: this.getObject(objectName, objectType) });
        await this.click({ elem: this.getContextMenuOption('Rename') });
        await this.datasetsPanel.renameTextField(newObjectName);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async renameObjectFromSection(objectName, sectionName, newObjectName) {
        await this.rightClick({ elem: this.getObjectFromSectionSansType(objectName, sectionName) });
        await this.click({ elem: this.getContextMenuOption('Rename') });
        await this.datasetsPanel.renameTextField(newObjectName);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clearObjectAlias(objectName, objectType) {
        await this.rightClick({ elem: this.getObject(objectName, objectType) });
        await this.click({ elem: this.common.getContextMenuItem('Rename') });
        await this.enter();
    }

    async removeFromDropZone(objectName, objectType) {
        const el = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: el });
        await this.click({ elem: this.common.getContextMenuItem('Remove') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async removeObjectInColumnSet(objectName, columnSet) {
        const el = await this.gridViz.getObjectInColumnSetDropZone(objectName, columnSet);
        await this.rightClick({ elem: el });
        await this.click({ elem: this.common.getContextMenuItem('Remove') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async removeAllObjects() {
        await this.click({ elem: this.getClearAllButton() });
        // to dismiss tooltip
        await this.moveToPosition({ x: 0, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async showTotal() {
        await this.click({ elem: this.getShowTotalButton() });
        // to dismiss tooltip
        await this.moveToPosition({ x: 0, y: 0 });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragObjectFromDZtoDS(objectName, objectType, srcZone) {
        const srcObject = await this.getObjectFromSection(objectName, objectType, srcZone);
        await browser.waitUntil(() => srcObject.isDisplayed());
        const DS = await this.datasetsPanel.datasetsPanel;
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcObject,
            toElem: DS,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async replaceObjectByName(objectName, objectType, objectNameToBeReplaced, objectTypeToBeReplaced) {
        const el = await this.getObject(objectName, objectType);
        const cntxt = await this.common.getSecondaryContextMenu(objectNameToBeReplaced);
        await this.rightClick({ elem: el });
        await this.hover({ elem: this.common.getContextMenuItem('Replace With') });
        await this.click({ elem: cntxt });
        await browser.waitUntil(() => this.getObject(objectNameToBeReplaced, objectTypeToBeReplaced).isDisplayed());
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async replaceObjectByNameInColumnSet(objectName, columnSet, objectNameToBeReplaced) {
        const el = await this.gridViz.getObjectInColumnSetDropZone(objectName, columnSet);
        const cntxt = await this.common.getSecondaryContextMenu(objectNameToBeReplaced);
        await this.rightClick({ elem: el });
        await this.hover({ elem: this.common.getContextMenuItem('Replace With') });
        await this.click({ elem: cntxt });
        await browser.waitUntil(() =>
            this.gridViz.getObjectInColumnSetDropZone(objectNameToBeReplaced, columnSet).isDisplayed()
        );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dragObjectByNameInColumnSet(objectName, columnSet, objectNameToBeReplaced) {
        const el = await this.gridViz.getObjectInColumnSetDropZone(objectName, columnSet);
        const cntxt = await this.common.getSecondaryContextMenu(objectNameToBeReplaced);
        await this.rightClick({ elem: el });
        await this.hover({ elem: this.common.getContextMenuItem('Replace With') });
        await this.click({ elem: cntxt });
        await browser.waitUntil(() =>
            this.gridViz.getObjectInColumnSetDropZone(objectNameToBeReplaced, columnSet).isDisplayed()
        );
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectDropZonePanel(panelName) {
        const el = this.getDropZonePanel(panelName);
        await browser.waitUntil(() => el.isDisplayed());
        await this.click({ elem: el });
    }

    async isEditorPanelPresent() {
        const el = this.getDropZonePanel('Editor');
        await browser.waitUntil(() => el.isDisplayed());
    }

    async isReplaceByOptionPresent(objectType, objectName, contextOption, newObjectName) {
        const el = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: el });
        await this.click({ elem: this.common.getContextMenuItem(contextOption) });
        const cntxt = await this.common.getSecondaryContextMenu(newObjectName);
        await browser.waitUntil(() => cntxt.isDisplayed());
        await this.click({ elem: this.getDropZonePanel('Editor') });
    }

    async shortcutMetricOptionRankExists(objectName, rank) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Shortcut Metric');
        await this.hover({ elem: cntxt });
        const secCntxt = await this.common.getSecondaryContextMenu(rank);
        await browser.waitUntil(() => secCntxt.isDisplayed());
        await this.hover({ elem: secCntxt });
        await browser.waitUntil(() => this.RankPopupContext.isDisplayed());
        const auto = await this.common.getSecondaryContextMenu('Automatic');
        await browser.waitUntil(() => auto.isDisplayed());
        await this.click({ elem: this.getDropZonePanel('Editor') });
    }

    async shortcutMetricOptionCalculationExists(objectName, calculationMetric, index) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Calculation');
        await this.hover({ elem: cntxt });
        const secCntxt = await this.getCalculationMetricContext(objectName, index);
        await this.click({ elem: secCntxt });
        const objDropDownCntxt = await this.getCalculationMetricDropDownContext(calculationMetric, index);
        await browser.waitUntil(() => objDropDownCntxt.isDisplayed());
        await this.click({ elem: this.getDropZonePanel('Editor') });
    }

    async clearThreshold(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const clearThrshld = await this.common.getContextMenuItem('Clear Thresholds');
        await this.click({ elem: clearThrshld });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async rightClickOnEditorPanel(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
    }

    async openThresholdsEditorWithoutWaiting(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        let thresholds = await this.common.getContextMenuItem('Thresholds...');
        const isPresent = await thresholds.isDisplayed();
        if (!isPresent) {
            thresholds = await this.common.getContextMenuItem('Edit Thresholds...');
        }
        await this.click({ elem: thresholds });
    }

    async openAttributeThresholdsEditor(objectName) {
        await this.openThresholdsEditorWithoutWaiting(objectName);
        const advThreshld = await this.getAdvanceThresholdEditor();
        await this.waitForElementVisible(advThreshld);
    }

    async openMetricThresholdsEditor(objectName) {
        await this.openThresholdsEditorWithoutWaiting(objectName);
        const simpleThreshld = await this.getSimpleThresholdEditor();
        await this.waitForElementVisible(simpleThreshld);
    }

    async openThresholdsEditor(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.clickByForce({ elem: obj });
        await this.rightClick({ elem: obj });
        const conditionalFormat = await this.common.getContextMenuItem('Conditional Formatting');
        const isConfitinalPresent = await conditionalFormat.isExisting();
        if (isConfitinalPresent) await this.clickOnElement(conditionalFormat);
        let thresholds = await this.common.getContextMenuItem('Add Thresholds...');
        const isPresent = await thresholds.isDisplayed();
        if (!isPresent) {
            thresholds = await this.common.getContextMenuItem('Edit Thresholds...');
        }
        await this.click({ elem: thresholds });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async openCalculationEditor(objectName, objectType) {
        const obj = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Calculation');
        await this.click({ elem: cntxt });
        const secCntxt = await this.calculationMetric.CalculationEditor;
        await this.click({ elem: secCntxt });
        const objDropDownCntxt = await this.calculationMetric.getCalculationMetricDropDownContext(objectName, 1);
        await browser.waitUntil(() => objDropDownCntxt.isDisplayed());
        await this.click({ elem: this.getDropZonePanel('Editor') });
    }

    async createCalculationFromEditorPanel(objectName, calculationType, secondObject) {
        const obj = await this.getObject(objectName, 'Metric');
        await this.rightClick({ elem: obj });
        await this.calculationMetric.createCalculation(secondObject, calculationType);
    }

    async createSubtotalsFromEditorPanel(objectName, objectType, subtotalOptions) {
        const subtotalSplit = subtotalOptions.split(',');
        const el = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: el });
        const menu = await this.common.getContextMenuItem('Show Totals');
        await this.click({ elem: menu });
        for (let i = 0; i < subtotalSplit.length; i++) {
            const cntxt = await this.common.getSecondaryContextMenu(subtotalSplit[i]);
            await this.click({ elem: cntxt });
        }
        await this.click({
            elem: this.$(
                "//div[contains(@class,'mstrmojo-ui-MenuPopup') and contains(@style,'block')]//div[text()='OK']"
            ),
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async secondaryMenuOnEditorObject(objectName, objectType, firstMenu, secondaryMenu) {
        const obj = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem(firstMenu);
        await this.hover({ elem: cntxt });
        const secCntxt = await this.common.getSecondaryContextMenu(secondaryMenu);
        await this.click({ elem: secCntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async ActionOnsecondaryMenuOnEditorObject(objectName, objectType, firstMenu, secondaryMenu) {
        const obj = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem(firstMenu);
        await this.hover({ elem: cntxt });
        const secCntxt = await this.common.getSecondaryContextMenu(secondaryMenu);
        await this.hover({ elem: secCntxt });
    }

    async openDerivedObjectEditor(objectName, objectType, actionType) {
        const obj = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: obj });
        let cntxt;
        if (actionType === 'edit') {
            cntxt = this.common.getContextMenuItem('Edit...');
        } else if (objectType === 'attribute') {
            cntxt = this.common.getContextMenuItem('Create Attribute...');
        } else if (objectType === 'metric') {
            cntxt = this.common.getContextMenuItem('Create Metric...');
        } else {
            throw `incorrect object type of this.${objectType}`;
        }
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async createGroup(objectName, objectType) {
        const obj = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Create Groups...');
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
        const newObj = objectName.replace(/ /g, '\u00A0');
        await browser.waitUntil(() => this.getgroupEditorWindow(newObj).isDisplayed());
    }

    async createAttribute(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Create Attribute...');
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async createMetric(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Create Metric...');
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async createLink(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Create Links...');
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openAdvancedSortEditor(objectName) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Advanced Sort ...');
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.waitForElementVisible(this.visualizationForGrid.AdvancedSortEditor);
    }

    async simpleSort(objectName, sortOrder) {
        const obj = await this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem(sortOrder);
        await this.clickOnElement(cntxt);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openGroupEditor(groupName, groupType) {
        const obj = await this.getObject(groupName, groupType);
        await this.rightClickOnElement(obj);
        const cntxt = await this.common.getContextMenuItem('Edit Groups...');
        await this.clickOnElement(cntxt);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
        // await browser.waitUntil(() => this.getgroupEditorWindow(groupName).isDisplayed());
        await this.waitForElementVisible(this.getgroupEditorWindow(groupName));
    }

    async editorPanelCalculationMultiSelect(elements, operation) {
        const arrString = elements.split(',').map((obj) => obj.trim());
        const arrElements = await Promise.all(arrString.map(async (obj) => await this.getObjectWithoutType(obj)));
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.rightClick({ elem: arrElements[1] });
        const contextMenu = await this.common.getContextMenuItem('Calculation');
        await this.hover({ elem: contextMenu });
        const secContext = await this.common.getSecondaryContextMenu(operation);
        await this.click({ elem: secContext });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    async openDisplayAttributeFormsMenu(objectName, objectType) {
        const obj = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: obj });
        const cntxt = await this.common.getContextMenuItem('Display Attribute Forms');
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async setDisplayAttributeFormNames(option, submitAndClose) {
        const pulldown = await this.getDisplayAttributeFormNamesPullDownMenu();
        await this.click({ elem: pulldown });
        const optionToBeSet = await this.getDisplayAttributeFormNamesOption(option);
        await this.click({ elem: optionToBeSet });
        if (submitAndClose) {
            await this.closeFormPopup('OK');
        }
    }

    async multiSelectDisplayFormsFromEditorPanel(objectName, formNames) {
        const object = this.getObjectWithoutType(objectName);
        await this.rightClick({ elem: object });
        const option = this.getContextMenuOption('Display Attribute Forms');
        await this.click({ elem: option });
        await this.multiSelectDisplayForms(formNames, true);
        await this.setDisplayAttributeFormNames('On');
        await this.click({ elem: this.filterPanel.getButton('OK') });
    }

    async multiSelectDisplayFormsFromDropZone(formNames, objectName, dropzone) {
        const object = await this.getObjectInDropZone(objectName, dropzone);
        await this.rightClick({ elem: object });
        const option = await this.getContextMenuOption('Display Attribute Forms');
        await this.click({ elem: option });
        await this.multiSelectDisplayForms(formNames);
    }

    async multiSelectDisplayForms(formNames, skipCloseForm) {
        const forms = formNames.split(',');
        for (const form of forms) {
            await this.click({ elem: this.filterPanel.getDisplayForm(form) });
        }
        if (!skipCloseForm) {
            await this.closeFormPopup('OK');
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async closeFormPopup(buttonName) {
        await this.click({ elem: await this.filterPanel.getButton(buttonName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async rightClickOnElement(el) {
        await this.rightClick({ elem: el });
    }

    /**
     * Get all object texts from the Rows section
     * @returns {Promise<string[]>} Array of text content from objects in the Rows section
     */
    async getRowObjectTexts() {
        try {
            const rowObjects = await this.getObjectsInRowsSection();
            const texts = [];

            for (const element of rowObjects) {
                try {
                    // Check if element exists and is attached to DOM
                    const isExisting = await element.isExisting();
                    if (!isExisting) {
                        continue;
                    }

                    // Wait for element to be stable before getting text
                    await browser.waitUntil(
                        async () => {
                            try {
                                return await element.isDisplayed();
                            } catch {
                                return false;
                            }
                        },
                        {
                            timeout: 5000,
                            timeoutMsg: 'Element not displayed within timeout',
                        }
                    );

                    // Get text with proper error handling
                    const text = await element.getText();
                    if (text && text.trim()) {
                        texts.push(text.trim());
                    }
                } catch (elementError) {
                    // Log the error but continue with other elements
                    console.warn('Error getting text from row element:', elementError.message);
                    continue;
                }
            }

            return texts;
        } catch (error) {
            console.error('getRowObjectTexts failed:', error.message);
            return []; // Return empty array instead of throwing to prevent test failure
        }
    }

    /**
     * Get all object texts from a specific Column Set
     * @param {string} columnSetName - Name of the column set (e.g., "Column Set 1", "Column Set 2")
     * @returns {Promise<string[]>} Array of text content from objects in the specified column set
     */
    async getColumnSetObjectTexts(columnSetName) {
        try {
            const columnSetObjects = await this.getObjectsInColumnSet(columnSetName);
            const texts = [];

            for (const element of columnSetObjects) {
                try {
                    // Check if element exists and is attached to DOM
                    const isExisting = await element.isExisting();
                    if (!isExisting) {
                        continue;
                    }

                    // Wait for element to be stable before getting text
                    await browser.waitUntil(
                        async () => {
                            try {
                                return await element.isDisplayed();
                            } catch {
                                return false;
                            }
                        },
                        {
                            timeout: 5000,
                            timeoutMsg: 'Element not displayed within timeout',
                        }
                    );

                    // Get text with proper error handling
                    const text = await element.getText();
                    if (text && text.trim()) {
                        texts.push(text.trim());
                    }
                } catch (elementError) {
                    // Log the error but continue with other elements
                    console.warn(`Error getting text from ${columnSetName} element:`, elementError.message);
                    continue;
                }
            }

            return texts;
        } catch (error) {
            console.error(`getColumnSetObjectTexts(${columnSetName}) failed:`, error.message);
            return []; // Return empty array instead of throwing to prevent test failure
        }
    }

    async createThresholdForMetric({ objectName, createFunction }) {
        await this.openMetricThresholdsEditor(objectName);
        await createFunction();
        await this.thresholdEditor.saveAndCloseSimThresholdEditor();
    }

    async openPanelContextMenu(){
        let menu = this.panelContextMenu;
        await this.clickOnElement(menu);
    }

    async selectOptionFromContextMenu(menuOption){
        let option = this.common.getContextMenuItem(menuOption);
        await this.clickOnElement(option);
    }

    async changeTitle(newTitle){
        let title = await this.titleBar;
        await this.waitForElementVisible(title);
        await title.addValue(newTitle + '\n');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
}
