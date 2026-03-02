import BaseContainer from './BaseContainer.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import DatasetPanel from './DatasetPanel.js';
import NgmEditorPanel from './NgmEditorPanel.js';
import DocAuthBasePage from '../dossier/DossierAuthoringPage.js';
import InCanvasSelector from './InCanvasSelector_Authoring.js';
import Common from './Common.js';
import DossierEditorUtility from '../dossierEditor/components/DossierEditorUtility.js';
import Utils from './Utils.js';

const visualizationContextMenuItem = {
    SHOW_TOTALS: 'Show Totals',
    SHOW_DATA: 'Show Data',
    REMOVE_DATA: 'Remove Data',
    DATA_SOURCE: 'Data Source',
    ADVANCED_SORT: 'Advanced Sort ...',
    CUSTOM_SORT: 'Custom Sort...',
    THRESHOLDS: 'Thresholds...',
    CREATE_CONTEXTUAL_LINK: 'Create Contextual Link',
    RENAME: 'Rename',
    DELETE: 'Delete',
    MORE_OPTIONS: 'More Options...',
};

/**
 * Page representing the Visualization panel grid
 * @extends BaseContainer
 * @author Harshad Pandhare <hpandhare@microstrategy.com>
 */
export default class VizPanelForGrid extends BaseContainer {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.common = new Common();
        this.datasetPanel = new DatasetPanel();
        this.ngmEditorPanel = new NgmEditorPanel();
        this.docAuthBasePage = new DocAuthBasePage();
        this.inCanvasSelector = new InCanvasSelector();
        this.dossierEditorUtility = new DossierEditorUtility();
    }

    //#region Element Locators
    get documentBody() {
        return this.$('body');
    }

    /** @type {Promise<ElementFinder>} */
    getContextMenuOption(contxtmenuoptn) {
        return this.$(`//div[contains(@class,'mstrmojo-ui-Menu-item-container')]//div[text()='${contxtmenuoptn}']`);
    }

    getObject(objectName, objectType) {
        let objectTypeName = Utils.objectTypeIdExtended(objectType.toLowerCase(), '');
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]//*[contains(@class,'${objectTypeName}')]//*[text()='${objectName}']`
        );
    }
    get metricSortClearIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.clr.mstrmojo-ui-Menu-item .micn');
    }
    get metricSortAscendingIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.asc.mstrmojo-ui-Menu-item .micn');
    }
    get metricSortDescendingIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.desc.mstrmojo-ui-Menu-item .micn');
    }

    getSortWithinAttribute(sortAttribute) {
        return this.$(
            `//a[contains(@class,'item xt') and contains(@class, 'mstrmojo-ui-Menu-item')]//*[text()='${sortAttribute}']`
        );
    }

    /** @type {Promise<ElementFinder>} */
    get renameEditor() {
        return this.$(
            `//div[@class='mstrmojo-Editor mstrmojo-rename-editor modal' and contains(@style,'display: block')]`
        );
    }

    /** @type {Promise<ElementFinder>} */
    get inputFieldFromRenameEditor() {
        return this.renameEditor.$(`.//input[contains(@class, 'mstrmojo-TextBox')]`);
    }

    /** @type {Promise<ElementFinder>} */
    get saveButtonFromRenameEditor() {
        return this.renameEditor.$(`.//div[contains(@class, 'mstrmojo-Button-text') and text()='Save']`);
    }

    /**
     * Page object for Advance Sort Window
     * @returns {Promise<boolean>}
     */
    get advancedSortWindow() {
        return this.$(
            `//div[contains(@class,'mstrmojo-AdvancedSortEditor')]//child::*[contains(text(),'Advance') and contains(text(),'Sort')]`
        );
    }

    get customSortWindow() {
        return this.$(`//div[contains(@class,'mstrmojo-CustomSortDisplayPanel')]`);
    }

    getButtonInCustomSortWindow(button) {
        return this.customSortWindow.$(`.//div[contains(@class,'mstrmojo-Button-text') and text() = '${button}']`);
    }

    get addColumnSetIcon() {
        return this.$("//div[@class='item mstrmojo-multixtab-addcolumnset']//div[@class='icn']");
    }

    /**
     * @param {string} visualizationName
     * @param {string} elementPartialValue
     */
    async getElementByPartialValueByViz(visualizationName, elementPartialValue) {
        let elementArray = [];
        await this.$(
            this.getContainerPath(visualizationName) +
                `//child::div[contains(@class, 'mstrmojo-scrollNode')]/div[@class='mstrmojo-XtabZone']//td[contains(text(),'${elementPartialValue}')]`
        ).each(function (el, index) {
            elementArray.push($(`(${el.locator().value})[${index + 1}]`));
        });
        return elementArray;
    }

    /**
     * @param {string} visualizationName
     * @type {Promise<ElementFinder>}
     * */
    getVisualizationTitleBarTextArea(visualizationName) {
        return this.$(
            this.canvasPath +
                `//div[contains(@class,'mstrmojo-UnitContainer') and contains(@class, 'mstrmojo-VIBox')]//div[contains(@class, 'title-text') and contains(@style, 'width')]//div[text() = '${visualizationName}']`
        );
    }

    getVisualizationTitleBarRoot(visualizationName) {
        return this.getVisualizationTitleBarTextArea(visualizationName).$(
            `./ancestor::div[contains(@class, 'mstrmojo-UnitContainer-titlebar')]`
        );
    }

    getVisualizationViTitleBar(visualizationName) {
        return this.getVisualizationTitleBarRoot(visualizationName).$(`./div[contains(@class, 'mstrmojo-VITitleBar')]`);
    }

    getGridContainer(visualizationName) {
        return this.$(
            `//div[@class='mstrmojo-DocSubPanel-content']//div[@class='mstrmojo-VIVizPanel-content']//div[@class='title-text']/div[text()='${visualizationName}']/ancestor::div[contains(@class, 'mstrmojo-UnitContainer') and contains(@class, 'mstrmojo-VIBox')]`
        );
    }
    

    GetMapType(visualizationName) {
        return this.getGridContainer(visualizationName).$(`.//div[contains(@id,'baseLayerDiv')]/div[1]`);
    }

    getContainerTitleBarBackground(visualizationName) {
        return this.$(`//div[@aria-label = '${visualizationName}' and contains(@class, 'mstrmojo-UnitContainer-root')]//div[@class='mstrmojo-UnitContainer-titleBarContainer-extendedBackground']`);
    }

    /**
     * @param {*} orientation "vertical" or "horizontal"
     * @param {*} visualizationName
     */
    getGridScrollBar(orientation, visualizationName) {
        orientation = orientation.toLowerCase();
        return this.getContainer(visualizationName).$(`.//div[@class = 'mstrmojo-scrollbar ${orientation}']`);
    }

    /**
     * @param {*} orientation "vertical" or "horizontal"
     * @param {*} visualizationName
     */
    getGridScrollTrack(orientation, visualizationName) {
        orientation = orientation.toLowerCase();
        return this.getGridContainer(visualizationName).$(`.//div[@class = 'mstrmojo-scrollbar ${orientation}']`);
    }

    getGridScrollNode(visualizationName) {
        return this.getContainer(visualizationName).$('.mstrmojo-scrollNode');
    }

    /**
     * Page object for secondary context menu
     * @param {string} option Secondary Context Menu option
     */
    getSecondaryContextMenu(secondaryOption) {
        let path = `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//child::*[text()='${secondaryOption}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$(path);
    }

    getColumnSetDropZone(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-ColumnSetList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div`
        );
    }

    getColumnSetEndInEditorPanel(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[(contains(@class, 'mstrmojo-ColumnSetList') or contains(@class, 'mstrmojo-MicroChartList')) and contains(@class,'mstrmojo-VIPanelPortlet') and contains(@style,'display: block;')]/div[contains(@class,'mstrmojo-VIPanel-handle splitter v')]`
        );
    }

    getColumnSetInEditorPanel(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[(contains(@class, 'mstrmojo-ColumnSetList') or contains(@class, 'mstrmojo-MicroChartList') or contains(@class, 'mstrmojo-ActionButton-portlet')) and contains(@class,'mstrmojo-VIPanelPortlet') and contains(@style,'display: block;')]`
        );
    }

    getColumnSetItemInEditorPanel(columnSetName, itemName) {
        return this.getColumnSetInEditorPanel(columnSetName).$(
            `.//div[contains(@class, 'item unit action-button')]//span[text()='${itemName}']`
        );
    }

    getColumnsSectionTileBar() {
        return this.$(
            `//div[@class='title-text']/div[text()='Columns']/ancestor::div[contains(@class, 'mstrmojo-VITitleBar')]`
        );
    }

    getColumnsSectionSplitter() {
        return this.$(
            `//div[@class='title-text']/div[text()='Columns']/ancestor::div[contains(@class, 'mstrmojo-VIPanelPortlet') and contains(@style,'display: block;')]/div[contains(@class,'mstrmojo-VIPanel-handle splitter v')]`
        );
    }

    getColumnSetDragArea(columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-VITitleBar')]`
        );
    }

    getColumnSetExpandCollapse(columnSetName) {
        return this.getColumnSetDragArea(columnSetName).$(
            `./div[@class='left-toolbar']//div[contains(@class, 'mstrmojo-Image')]`
        );
    }

    getColumnSetTitleAtPos(columnSetPosition) {
        return this.$(
            `(//div[contains(@class, 'mstrmojo-ColumnSetList-portlet')])[${columnSetPosition}]//div[contains(@class, 'mstrmojo-EditableLabel')]`
        );
    }

    getColumnSetDeleteButton(columnSetName) {
        return this.getColumnSetDragArea(columnSetName).$(
            `./div[@class='right-toolbar']//div[contains(@class, 'cls')]`
        );
    }

    getMicrochartEditButton(setName, microchartName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${setName}']/ancestor::div[contains(@class, 'mstrmojo-MicroChartList-portlet')]//span[text()='${microchartName}']/../div[contains(@class, 'edit')]`
        );
    }

    getDropZone(zone) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]/descendant::div[text()='${zone}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/following-sibling::div[@class='mstrmojo-VIPanel-content']/div/div`
        );
    }

    getObjectInColumnSetDropZone(desObject, columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-ColumnSetList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div//span[text()='${desObject}']`
        );
    }

    getObjectInColumnSetDropZone2(desObject, columnSetName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${columnSetName}']/ancestor::div[contains(@class, 'mstrmojo-ColumnSetList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div//span[text()='${desObject}']/ancestor::div[contains(@class,'item unit')]`
        );
    }

    getMicrochartDropZone(microchartName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${microchartName}']/ancestor::div[contains(@class, 'mstrmojo-MicroChartList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div`
        );
    }

    getObjectInMicrochartDropZone(desObject, microchartName) {
        return this.$(
            `//div[@class='title-text']/div[text()='${microchartName}']/ancestor::div[contains(@class, 'mstrmojo-MicroChartList-portlet') and contains(@style,'block')]//div[contains(@class,'content')]/div[@class='mstrmojo-ListBase mstrmojo-VIUnitList']/div//span[text()='${desObject}']`
        );
    }

    getObjectInDropZone(desObject, zone) {
        return $(
            `//div[contains(@class, 'mstrmojo-VIVizEditor')]/descendant::div[text()='${zone}']/ancestor::div[@class='mstrmojo-VIPanel-titlebar']/following-sibling::div[@class='mstrmojo-VIPanel-content']/div/div/descendant::span[text()='${desObject}']`
        );
        // return this.$(
        //     `//div[@class='mstrmojo-VIPanel mstrmojo-VIPanelPortlet' and descendant::div[text()='${zone}']]//span[text()='${desObject}']`
        // );
    }

    /**
     * Gets div between columns for resizing
     * @param {*} colNum is zero based
     * @param {*} visualizationName
     */
    getColumnBorder(colNum, visualizationName) {
        return this.getGridContainer(visualizationName).$(`(//div[@class='xrsz' and @idx=${colNum - 1}])[1]`);
    }

    /**
     * Gets object (column) header
     * @param {string} visualizationName
     * @param {string} objectName
     * @returns {Promise<ElementFinder>} Column header
     */
    async getObjectHeader(objectName, visualizationName) {
        // Implemeted as in Java framework. Reuse the existing script
        let title = await this.getVisualizationTitleBarTextArea(visualizationName);
        let xPathbase = await title.selector;
        let path = `${await xPathbase}/../../../../../..//div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class,'mstrmojo-XtabZone')]//td[text()='${objectName}']`;
        return this.$(path);
    }

    // to check whether header is locked (rendered twice) or not
    getObjectHeaderToVerifyLock(objectName, visualizationName) {
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class,'mstrmojo-XtabZone')]//td[text()='${objectName}']`;
        return this.$(path).length;
    }

    /** Gets object of the grid
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObject(objectName, visualizationName) {
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class,'mstrmojo-XtabZone')]//child::tbody//child::tr//child::td[text()='${objectName}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$$(path)[0];
    }

    getSelectedGridObject(objectName, visualizationName) {
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class,'mstrmojo-XtabZone')]//child::tbody//child::tr//child::td[contains(@class, 'xtabSel') and text()='${objectName}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$$(path)[0];
    }

    /** Gets object of the grid with hyper link
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectWithHyperLink(objectName, visualizationName) {
        let path =
            this.getContainerPath(visualizationName) +
            `//div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class,'mstrmojo-XtabZone')]//child::tbody//child::tr//child::td/span/a[text()='${objectName}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$$(path)[0];
    }

    getAllGridObject(visualizationName) {
        // Add @style to get the viz on the current panel
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class,'mstrmojo-XtabZone')]//child::tbody//child::tr`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$$(path);
    }

    getAllGridObjectCount(visualizationName) {
        return this.getAllGridObject(visualizationName).length;
    }

    /** Gets outline mode collapse/expand icon from object in the grid
     *
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     *
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectOutline(objectName, visualizationName) {
        return this.getGridObject(objectName, visualizationName).$(`./span[contains(@class, 'icon-outline-span')]`);
    }

    /**
     * Gets outline mode expand button from object of the grid
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectExpand(objectName, visualizationName) {
        return this.getGridObject(objectName, visualizationName).$(`.//span[contains(@class, 'outline-expand')]`);
    }

    /**
     * Gets outline mode collapse button from object of the grid
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectCollapse(objectName, visualizationName) {
        return this.getGridObject(objectName, visualizationName).$(`.//span[contains(@class, 'outline-collapse')]`);
    }

    /**
     * Gets outline mode expand button from element of the grid
     * @param {string} elementName element name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridElementExpand(elementName, visualizationName) {
        return this.getGridElement(elementName, visualizationName).$(`.//span[contains(@class, 'outline-expand')]`);
    }

    /**
     * Gets outline mode collapse button from element of the grid
     * @param {string} elementName element name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridElementCollapse(elementName, visualizationName) {
        return this.getGridElement(elementName, visualizationName).$(`.//span[contains(@class, 'outline-collapse')]`);
    }

    /**
     * @param {string} visualizationName visualization name
     * @param {string} objectName - Name of the object
     * @returns {Promise<ElementFinder>} objectName
     */
    getGridObjectHeader(objectName, visualizationName) {
        return this.$(
            `//div[@class='mstrmojo-UnitContainer-titlebar']//child::*[text()='${visualizationName}']//parent::*//parent::*//parent::*//following-sibling::*[@class='mstrmojo-UnitContainer-content']//child::*[@class='mstrmojo-Xtab-content ']//child::*[text()='${objectName}'][@title]`
        );
    }

    /** Get first grid element
     * @param {string} visualizationName visualization name
     * @param {string} elementName Name of the Element
     * @returns {Promise<ElementFinder>} VisualizationName
     */
    getGridElement(elementName, visualizationName) {
        let path = `.//child::div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class, 'mstrmojo-XtabZone')]//td[text()='${elementName}']`;
        return this.getContainerContent(visualizationName).$$(path)[0];
    }

    /** Get grid element for MDX-RA (Attribute in outline mode)
     * @param {string} visualizationName visualization name
     * @param {string} elementName Name of the Element
     * @returns {Promise<ElementFinder>} VisualizationName
     */
    getGridElement2(elementName, visualizationName) {
        let path = `.//child::div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class, 'mstrmojo-XtabZone')]//td//span[contains(text(),'${elementName}')]/../..`;
        return this.getContainerContent(visualizationName).$$(path)[0];
    }

    /** Get first grid element with hyper link
     * @param {string} visualizationName visualization name
     * @param {string} elementName Name of the Element
     * @returns {Promise<ElementFinder>} VisualizationName
     */
    getGridElementWithHyperLink(elementName, visualizationName) {
        return this.getContainerContent(visualizationName).$(
            `.//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//a[text()='${elementName}']`
        );
    }

    getEncodedGridCell(cellValue, visualizationName) {
        let path = `.//child::div[contains(@class, 'mstrmojo-scrollNode')]/div[contains(@class, 'mstrmojo-XtabZone')]//td/span[text()='${cellValue}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.getContainerContent(visualizationName).$$(path)[0];
    }

    /**
     * Get grid cell at specific row/column position
     *
     * @param {int} row Row
     * @param {int} col Column
     * @param {string} visualizationName Visualization name
     *
     * @returns {Promise<ElementFinder>} Cell
     */
    getGridCellByPosition(row, col, visualizationName) {
        // Note: tbody[not(@n)] is necessary for selections made in "outline mode"
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//tbody[not(@n)]//tr[${row}]//td[${col}]`;
        return this.$(path);
    }

    async getGridCellStyleByPosition(row, col, visualizationName, style) {
        const el = await this.getGridCellByPosition(row, col, visualizationName);
        await this.waitForElementVisible(el);
        const cssProperty = await el.getCSSProperty(style);
        return cssProperty && cssProperty.value ? cssProperty.value.toString() : '';
    }

    async getGridCellTextByPosition(row, col, visualizationName) {
        const el = await this.getGridCellByPosition(row, col, visualizationName);
        await this.waitForElementVisible(el);
        return el.getText();
    }

    getGridCellByPositioRegardlessFetchBlocks(row, col, visualizationName) {
        let path = `(${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//tbody//td[@r='${row}'])[${col}]`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$(path);
    }

    /**
     * Get the text of the grid cell with link at specific row/column position
     *
     * @param {int} row Row
     * @param {int} col Column
     * @param {string} visualizationName Visualization name
     *
     * @returns {Promise<ElementFinder>} Cell
     */
    getGridCellTextWithLinkByPosition(row, col, visualizationName) {
        // Note: tbody[not(@n)] is necessary for selections made in "outline mode"
        let path = `${this.getContainerPath(
            visualizationName
        )}//div[contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class, 'mstrmojo-XtabZone')]//tbody[not(@n)]//tr[${row}]//td[${col}]/a`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }

        return this.$(path);
    }

    getGridCellChildByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$('./a');
    }

    getGridCellChildsvgByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$('.//*[name() = "svg"]');
    }

    getGridCellChildWarningIconByPosition(row, col, visualizationName) {
        return this.getGridCellByPosition(row, col, visualizationName).$('.//span[@class="htmlEnc"]');
    }

    getSortRowbyOrder(order) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${order}]//button[contains(@class,'mstr-advanced-sort-order')]`
        );
    }

    get AdvancedSortEditor() {
        return this.$(`.mstrmojo-AdvancedSortEditorReact[style*='display: block']`);
    }

    get NumberOfRowsInAdvancedSortEditor() {
        return this.$$(`.mstr-advanced-sort-rulesPanel .mstr-advanced-sort-item`).length;
    }
    getSortObjectPulldown(columnOrder) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${columnOrder}]//div[contains(@class,'mstr-advanced-sort-orderSelect')]`
        );
    }

    getSortOrderPulldown(columnOrder) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${columnOrder}]//div[contains(@class,'mstr-advanced-sort-sortSelect')]`
        );
    }

    getSortObjectPopList(objectName) {
        return this.$(
            `//div[contains(@class,'mstr-advanced-sort-orderSelect-dropdown__dropdown-list')]//span[text()='${objectName}']`
        );
    }

    getSortDeleteRowButton(columnOrder) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${columnOrder}]//button[contains(@class,'mstr-advanced-sort-delete')]`
        );
    }

    getSortOrderPopList(sortOrder) {
        let sortOrderName = 'Ascending';
        switch (sortOrder.toLowerCase()) {
            case 'ascending':
                sortOrderName = 'Ascending';
                break;
            case 'descending':
                sortOrderName = 'Descending';
                break;
        }

        return this.$(
            `//div[contains(@class,'mstr-advanced-sort-sortSelect-dropdown__dropdown-list')]//span[text()='${sortOrderName}']`
        );
    }

    getSortEditorButton(buttonName) {
        return this.$(`//div[contains(@class,'mstr-advanced-sort-actions')]//button[text()='${buttonName}']`);
    }

    getSortEditorSwitchButton(buttonName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-AdvancedSortEditorReact')]//div[contains(@class,'mstr-toggle-group')]//button[contains(text(),'${buttonName}')]`
        );
    }

    getAdvancedSortEditorScrollBar(orientation) {
        orientation = orientation.toLowerCase();
        return this.$(
            `//div[contains(@class,'mstrmojo-AdvancedSortEditor-RulesPanel mstrmojo-scrollNode')]/following-sibling::div[contains(@class,'scrolltrack')]/div[@class = 'mstrmojo-scrollbar ${orientation}']`
        );
    }

    getAdvancedSortEditorRulesPanel() {
        return this.$(
            `//ul[contains(@class,'mstr-advanced-sort-rulesPanel')]`
        );
    }

    /** Get sort rule object pulldown, depending if it is enabled/disabled
     * @param {string} columnOrder the order of the sort criteria in the advanced sort editor
     * @param {Boolean} isEnabled true if element is enabled
     */
    getSortRuleObjectPulldown(columnOrder, isEnabled) {
        if (isEnabled) {
            return this.getSortObjectPulldown(columnOrder).$(`./parent::div[not(contains(@class, 'disabled'))]`);
        } else {
            return this.getSortObjectPulldown(columnOrder).$(`./parent::div[contains(@class, 'disabled')]`);
        }
    }

    /**
     * NUMBER FORMATTING GETTERS
     */
    /** pulldown to switch between Automatic, Date, Time, Fraction, etc. */
    getNfCategoryPulldown() {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-category')]`);
    }

    /**
     * the 3 icons ',' $ and %
     * @param {*} shortcut: fixed, currency, percentage
     */
    getNfShortcutsIcon(shortcut) {
        let className = 'nf-shortcut-' + shortcut;

        return this.$(`//div[contains(@class, 'mstrmojo-Button') and contains(@class, '${className}')]`);
    }

    /**
     * the 2 decimal place buttons to increase or decrease
     * @param {*} direction left or right
     */
    getNfDecimalMoverBtn(direction) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-Button') and contains(@class, 'nf-MoveDecimalPoint') and contains(@class, '${direction}')]`
        );
    }

    /** Only for Fixed Number Format */
    getNfThousandSeparator() {
        return this.$(`//span[contains(@class, 'mstrmojo-CheckBox') and contains(@class, 'nf-MiddleRow')]`);
    }

    /** Only for Currency Number Format */
    getNfCurrencySymbolPulldown() {
        return this.$(`//div[contains(@class, 'nf-CurrencySymbol')]//div[contains(@class,'btn')]`);
    }

    getNfCurrencyPositionPulldown() {
        return this.$(`//div[contains(@class, 'nf-CurrencyPosition')]`);
    }

    /** The extra pulldown for Date, Time, Fraction */
    getNfValueFormatPulldown() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-MiddleRow') and contains(@class, 'nf-HasWidget') and @style='display: block;']`
        );
    }

    getNfValueFormatPulldownOption(option) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-MiddleRow') and contains(@class, 'nf-HasWidget')]//div[contains(@class, 'item') and text()='${option}']`
        );
    }

    getNfValueFormatPulldownSelection() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted') and contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-MiddleRow') and contains(@class, 'nf-HasWidget')]//div[contains(@class, 'item') and contains(@class, 'selected')]`
        );
    }

    /** Extra configuration for Custom Number Format */
    getNfCondenseButton() {
        return this.$(`//div[contains(@class, 'mstrmojo-Button') and contains(@class, 'nf-condense')]`);
    }

    getNfCustomTextbox() {
        return this.$(`//input[contains(@class, 'mstrmojo-TextBox') and contains(@class, 'nf-custom')]`);
    }

    /** Pulldown to choose regarding negative values for Fixed, Currency, Percentage */
    getNfNegativePulldown() {
        return this.$(
            `//table[contains(@class, 'nf-HasWidget') and @style='display: table;']//div[contains(@class, 'mstrmojo-ui-Pulldown') and contains(@class, 'nf-NegativePullDown')]`
        );
    }

    /**
     *
     * @param {*} form
     * @param {*} inRed boolean depending if it shows up as Red or Black in the pulldown
     */
    getNfNegativePopupListItem(form, inRed) {
        let path = `//div[contains(@class, 'mstrmojo-popupList-scrollBar') and contains(@class, 'mstrmojo-scrollNode')]//div[contains(@class,'item ${
            inRed ? 'red' : ''
        }') and text()='${form}']`;
        // if (browsers.params.environment.npmMode === 'mac workstation') {
        //     path = path.replace('mstrmojo-scrollNode', 'mstrmojo-sb-show-default');
        // }
        return this.$(path);
    }

    get moreOptions() {
        return this.$(`//div[contains(@class, 'mstrmojo-MoreOptions-Editor')]`);
    }

    /**
     *
     * @param {*} headerType row or column
     * @param {*} propertyName Merge, Show, Lock
     */
    getMoreOptionsHeaderProperty(headerType, propertyName) {
        // row header is first in DOM tree
        let index = headerType.toLowerCase() === 'row' ? 1 : 2;
        return this.moreOptions.$(`(.//span[text()='${propertyName}']/..)[${index}]`);
    }

    /**
     * @param {*} buttonName Save or Cancel
     */
    getMoreOptionsButton(buttonName) {
        return this.moreOptions.$(`.//div[contains(@class, 'mstrmojo-Button-text') and text()='${buttonName}']`);
    }

    get toolBox() {
        return this.$(
            `//div[contains(@class, 'mstrmojo-popup-widget-hosted')]/div[contains(@class, 'mstrmojo-ui-ToolbarPopup') and contains(@class, 'mstrmojo-ui-EditCharacter') and contains(@style, 'display: block')]`
        );
    }

    get currentDossierContextLinkBtn() {
        return this.$(
            `//div[contains(@class, 'contextual-link-editor')]//span[contains(@class, 'mstrmojo-TabButton') and position() = 1]`
        );
    }

    get editorPanelTab() {
        return this.$("//div[contains(@class, 'edt')]/div[contains(text(),'Editor')]");
    }

    get editorPanelVizTitle() {
        return this.$(
            `//*[contains(@class,"mstrmojo-VIVizEditor")]//div[contains(@class,"mstrmojo-VIBoxPanel-control")]//div[contains(@class,"mstrmojo-VITitleBar")]//div[contains(@class,"title-text")]//div[contains(@class,"mstrmojo-EditableLabel")]`
        );
    }

    get editorPanelVizTitleMenu() {
        return this.$(
            `//div[contains(@class,"mstrmojo-VIBoxPanelContainer-content")]//div[contains(@class,"mstrmojo-VIVizEditor")]//div[contains(@class,"mstrmojo-VIBoxPanel-control")]//div[contains(@class,"mstrmojo-VITitleBar")]//*[contains(@class,"right-toolbar")]//div[contains(@class,"mstrmojo-ListBase mstrmojo-VIToolbar mstrmojo-VITitleToolbar")]`
        );
    }

    getWarningTooltips(tooltips) {
        const parts = tooltips.split(/<br>/);
        let newTooltips = `contains(text(), '${parts[0]}')`;
        for (let i = 1; i < parts.length; i++) {
            newTooltips += ` and contains(., '${parts[i]}')`;
        }
        const path =
            `//div[contains(@class,'mstrmojo-Tooltip') and contains(@style,'display: block;')]//div[contains(@class,'mstrmojo-Tooltip-content') and ` +
            newTooltips +
            `]`;
        return this.$(path);
    }

    getTooltipsText() {
        const el = this.$(`//div[contains(@class,'mstrmojo-Tooltip') and contains(@style,'display: block;')]//div[contains(@class,'mstrmojo-Tooltip-content mstrmojo-scrollNode')]`);
        return el.getText();
    }

    getNewVisLinkTooltips(tooltips) {
        const parts = tooltips.split(/<br>/);
        let newTooltips = `contains(text(), '${parts[0]}')`;
        for (let i = 1; i < parts.length; i++) {
            newTooltips += ` and contains(., '${parts[i]}')`;
        }
        const path =
            `//div[contains(@class,'new-vis-tooltip') and contains(@style,'display: block;')]//div[contains(@class,'new-vis-tooltip-link') and ` +
            newTooltips +
            `]`;
        return this.$(path);
    }

    getButtonInWarningDialog(buttonName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-warning  mstrmojo-alert')]//div[contains(@class,'mstrmojo-Button-text') and text()='${buttonName}']`
        );
    }

    /**
     * This method resets the context menu button so it can be clicked again
     * Have at the beginning of any methods that click the visualization context menu button
     * @param {string} visualizationTitle the title of the visualization that you're about to perform actions on
     */
    async resetContextMenuButton(visualizationName) {
        let visualizationTitlebar = await this.getVisualizationTitleBarTextArea(visualizationName);
        await this.hover({ elem: visualizationTitlebar });
    }

    /**
     * Rename a column header (object)
     * @param {string} objectName
     * @param {string} visualizationName
     * @param {string} newObjectName
     */
    async renameObject(objectName, visualizationName, newObjectName) {
        let objectElement = await this.getObjectHeader(objectName, visualizationName);
        await this.rightClick({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption('Rename...') });
        let inputField = await this.inputFieldFromRenameEditor;
        await this.clear(inputField);
        await inputField.setValue(newObjectName);
        await this.click({ elem: this.saveButtonFromRenameEditor });
    }

    /**
     * check whether the object is on the Grid Visualization
     * @param {string} objectName - MSTR object name
     * @param {string} visualizationName - visualization Name
     */
    async existObjectByName(objectName, visualizationName) {
        let objectElement = await this.getGridObjectHeader(objectName, visualizationName);
        await this.waitForElementVisible(objectElement);
        return objectElement.isDisplayed();
    }

    async isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName) {
        // Locate the cell by its text
        const cell = await this.getObjectHeader(cellText, visualizationName);

        // Right-click on the cell to open the context menu
        await cell.click({ button: 'right' });

        // Check if the context menu option exists
        const menuOptionElement = await this.getContextMenuOption(menuOption);
        return await menuOptionElement.isExisting();
    }

    /**
     * Check whether there is Replace with option present on the Grid object
     * @param {string} objectName
     * @param {string} visualizationName - Name of the visualization
     * @param {String} targetObject - Whether the target object present or not
     * @returns {boolean}
     */
    async existReplaceByOption(objectName, visualizationName, targetObject) {
        let el = await this.getObjectHeader(objectName, visualizationName);
        let cntxt = await this.getSecondaryContextMenu(targetObject);
        await this.rightClick({ elem: el });
        await this.click({ elem: this.getContextMenuOption('Replace With') });
        await this.waitForElementVisible(cntxt);
        return cntxt.isDisplayed();
    }

    /**
     * Replace the object in the grid with the other object which is available in Replace With context menu
     * @param {string} objectName
     * @param {String} targetObject
     * @param {string} visualizationName - Name of the visualization
     * @returns {boolean}
     */
    async replaceObjectWithinGrid(objectName, targetObject, visualizationName, waitForLoadingDialog = true) {
        let el = await this.getObjectHeader(objectName, visualizationName);
        let cntxt = await this.getSecondaryContextMenu(targetObject);
        await this.rightClick({ elem: el, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption('Replace With') });
        await this.waitForElementVisible(cntxt);
        await this.click({ elem: cntxt });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    /**
     * Check whether there Drill option present on the Grid object
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     * @param {String} targetObject - Whether the target object present or not
     * @returns {boolean}
     */
    async existDrillOption(objectName, visualizationName, targetObject) {
        let el = await this.getObjectHeader(objectName, visualizationName);
        let cntxt = await this.getSecondaryContextMenu(targetObject);
        await this.rightClick({ elem: el });
        await this.click({ elem: this.getContextMenuOption('Drill') });
        await this.waitForElementVisible(cntxt);
        return cntxt.isDisplayed();
    }

    /**
     * To sort the object(column header) in ascending order
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async sortAscending(objectName, visualizationName) {
        let objectElement = await this.getObjectHeader(objectName, visualizationName);
        await this.rightClick({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption('Sort Ascending') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
    }

    async metricSortFromViz(objectName, visualizationName, order) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.rightClick({ elem: objectElement });
        let cntxt;
        if (order.toLowerCase() == 'ascending') {
            cntxt = this.metricSortAscendingIcon;
        } else if (order.toLowerCase() == 'descending') {
            cntxt = this.metricSortDescendingIcon;
        } else if (order.toLowerCase() == 'clear') {
            cntxt = this.metricSortClearIcon;
        } else {
            throw 'Invalid operation';
        }
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async clickMetricSortAscending(objType, objName) {
        let obj = await this.getObject(objName, objType);
        await this.rightClick({ elem: obj });
        let cntxt = await this.metricSortAscendingIcon;
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickMetricSortDescending(objType, objName) {
        let obj = await this.getObject(objName, objType);
        await this.rightClick({ elem: obj });
        let cntxt = await this.metricSortDescendingIcon;
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
    async clickMetricClearSort(objType, objName) {
        let obj = await this.getObject(objName, objType);
        await this.rightClick({ elem: obj });
        let cntxt = await this.metricSortClearIcon;
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSortIconsFromElement(objectType, objectName, visualizationName) {
        await this.rightClick({ elem: await this.getGridObject(objectName, visualizationName) });
        await this.click({ elem: this.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectSortWithinAttribute(objectType, objectName, sortType, sortAttr) {
        let obj = await this.getObject(objectName, objectType);
        await this.rightClick({ elem: obj });
        let cntxt = await this.common.getContextMenuItem(sortType);
        await this.click({ elem: cntxt });
        let srtAtt = await this.getSortWithinAttribute(sortAttr);
        await this.click({ elem: srtAtt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }
    /**
     * To sort the object(column header) in descending order
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */

    async sortDescending(objectName, visualizationName, waitForLoadingDialog = true) {
        let objectElement = await this.getObjectHeader(objectName, visualizationName);
        await this.rightClick({ elem: objectElement, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption('Sort Descending') });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(30);
        }
    }

    /**
     * Open advanced sort editor from grid
     * @param {string} objectName - name of object to open the advanced sort editor from
     * @param {string} visualizationName - Name of the visualization
     */
    async openAdvancedSortEditor(objectName, visualizationName) {
        let objectElement = await this.getObjectHeader(objectName, visualizationName);
        await this.rightClick({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption(visualizationContextMenuItem.ADVANCED_SORT) });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
        await this.waitForElementVisible(this.advancedSortWindow);
    }

    /**
     * Open custom sort editor from grid
     * @param {string} objectName - name of object to open the advanced sort editor from
     * @param {string} visualizationName - Name of the visualization
     */
    async openCustomSortEditor(objectName, visualizationName) {
        let objectElement = await this.getObjectHeader(objectName, visualizationName);
        await this.rightClick({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption(visualizationContextMenuItem.CUSTOM_SORT) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Click on the button in Custom Sort window
     * @param {string} buttonTxt - text on the button, 'OK', 'Cancel', 'Apply'
     */
    async clickButtonInCustomSortEditor(buttonTxt) {
        let el = await this.getButtonInCustomSortWindow(buttonTxt);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Select column and sort order in advanced sort editor
     * @param {string} columnOrder - the order of the sort criteria in the advanced sort editor
     * @param {string} objectName - name of object to sort
     * @param {string} sortOrder - Ascending or Descending
     */
    async addAdvancedSortParameter(columnOrder, objectName, sortOrder) {
        let objectPulldown = await this.getSortObjectPulldown(columnOrder);
        await this.click({ elem: objectPulldown });
        await this.click({ elem: this.getSortObjectPopList(objectName) });

        let sortOrderPulldown = await this.getSortOrderPulldown(columnOrder);
        await this.click({ elem: sortOrderPulldown });
        await this.click({ elem: this.getSortOrderPopList(sortOrder) });

        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async saveAndCloseSortEditor() {
        await this.click({ elem: this.getSortEditorButton('OK') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async closeSortEditor() {
        await this.click({ elem: this.getSortEditorButton('Cancel') });
    }

    async switchRowColumnInSortEditor(buttonName) {
        await this.click({ elem: this.getSortEditorSwitchButton(buttonName) });
    }

    /** Click on delete row button
     * @param {string} columnOrder the order of the sort criteria in the advanced sort editor
     */
    async clickSortDeleteRowButton(columnOrder) {
        let el = this.getSortDeleteRowButton(columnOrder);
        await this.click({ elem: el });
    }

    async moveToSpecificLocationAndWait(desPosition, srcElement, desElement, offsetX = 0, offsetY = 10) {
        await this.waitForElementVisible(srcElement);
        await this.hover({ elem: srcElement });
        if (desPosition == 'above') {
            offsetY = -Math.abs(offsetY);
            await this.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: offsetX, y: offsetY },
            });
        } else if (desPosition == 'below') {
            offsetY = Math.abs(offsetY);
            await this.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: offsetX, y: offsetY },
            });
        } else if (desPosition == 'replace') {
            await this.dragAndDropForAuthoringWithOffset({
                fromElem: srcElement,
                toElem: desElement,
                toOffset: { x: offsetX, y: 0 },
            });
        } else {
            throw 'Wrong location of the moving object';
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Switch sort rows position in the Advanced Sort Editor
     * @param {string} srcSortRow
     * @param {string} desPosition "above" or "below"
     * @param {string} desSortRow
     */
    async dragSortRowwithPositionInAdvancedSortEditor(srcSortRow, desPosition, desSortRow) {
        let srcel = await this.getSortRowbyOrder(srcSortRow);
        await this.waitForElementVisible(srcel);
        let desel = await this.getSortRowbyOrder(desSortRow);
        await this.waitForElementVisible(desel);
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel);
    }

    async moveAdvancedSortEditorScrollBar(direction, pixels) {
        let orientation = direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical',
            scrollbar = await this.getAdvancedSortEditorScrollBar(orientation),
            numOfPixels = direction === 'left' || direction === 'top' ? -pixels : pixels;

        await this.dragAndDropByPixel(
            scrollbar,
            orientation === 'horizontal' ? numOfPixels : 0,
            orientation === 'vertical' ? numOfPixels : 0,
            true
        );
    }

    async hoverOverAdvancedSortRulesPanel() {
        await this.hover({ elem: await this.getAdvancedSortEditorRulesPanel() });
    }

    /**
     * To click on an elemnt in grid
     * @param {string} objectName - Name of the element
     * @param {string} visualizationName - Name of the visualization
     */
    async clickOnGridElement(objectName, visualizationName) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async clickOnGridElementWithoutLoading(objectName, visualizationName) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.click({ elem: objectElement });
    }

    async hoverOnGridElement(objectName, visualizationName) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.hover({ elem: objectElement });
    }

    /**
     * To keep only one element in the grid object
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async keepOnly(objectName, visualizationName, waitForLoadingDialog = true) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.rightClick({ elem: objectElement, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption('Keep Only') });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async excludeElement(objectName, visualizationName, waitForLoadingDialog = true) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.rightClick({ elem: objectElement, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption('Exclude') });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async mouseOverGridCellByPosition(row, col, visualization) {
        let cell = await this.getGridCellByPosition(row, col, visualization);
        await browser.pause(1000);
        await this.hover({ elem: cell });
    }
    /**
     * Open a speicific context menu item for grid cells
     * @param {string} gridCellNames - Names of the grid cells
     * @param {string} visualizationName - Name of the visualization
     */
    async openContextMenuItemForGridCells(gridCellNames, menuItemName, visualizationName) {
        let arrString = gridCellNames.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridObject(arrString[i], visualizationName));
        }

        await this.rightMouseClickOnElements(arrElements);
        await this.click({ elem: this.getContextMenuOption(menuItemName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async rightMouseClickOnElements(elements, waitForLoadingDialog){
        let dndInnerTime = (0.2 * 1000); // Allow DND animation work properly
        await elements[0].click({ button: 0});
        let el = await this.loadingDialog.getLoadingDataPopUpDisplayed();	
        let present = await el.isDisplayed();
        if(present) {
            waitForLoadingDialog = true;
        }
        let i;
        for(i = 1; i < elements.length; i++){	
            await this.ctrlClick({ elem: elements[i] });
            if (waitForLoadingDialog) {	
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();	
            }	
        }
        await elements[i-1].moveTo();
        await browser.pause(dndInnerTime);
        await elements[i-1].click({ button: 2 });
        await browser.pause(dndInnerTime);
    }

    async openContextMenuItemForGridCell(gridCellName, menuItemName, visualizationName) {
        let arrElement = this.getGridObject(gridCellName, visualizationName);
        await this.rightClick({ elem: arrElement });
        await this.click({ elem: this.getContextMenuOption(menuItemName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    async openContextMenuItemForGridCellByPosition(row, col, menuItemName, visualizationName) {
        let cell = this.getGridCellByPosition(row, col, visualizationName);
        await this.rightClick({ elem: cell });
        await this.click({ elem: this.getContextMenuOption(menuItemName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Open a speicific context menu item for grid cells by applying the offset when RMC click on the grid cells,
     * usually needed when selecting the cells in column headers, or selection the grid cells in both rows and columns
     * @param {string} gridCellNames - Names of the grid cells
     * @param {string} visualizationName - Name of the visualization
     */
    async openContextMenuItemForGridCellsByOffSet(
        gridCellNames,
        menuItemName,
        visualizationName,
        offsetX = 1,
        offsetY = 1
    ) {
        let arrString = gridCellNames.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(await this.getGridObject(arrString[i], visualizationName));
        }

        await this.rightMouseClickOnElementsbyOffSet(arrElements, offsetX, offsetY);
        await this.click({ elem: this.getContextMenuOption(menuItemName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async rightMouseClickOnElementsbyOffSet(elements, offsetX, offsetY, waitForLoadingDialog){
        let dndInnerTime = (0.2 * 1000); // Allow DND animation work properly
        await elements[0].click({ button: 0, x: offsetX, y: offsetY });
        let el = await this.loadingDialog.getLoadingDataPopUpDisplayed();	
        let present = await el.isDisplayed();
        if(present) {
            waitForLoadingDialog = true;
        }
        let i;
        for(i = 1; i < elements.length; i++){	
            await this.ctrlClick({ elem: elements[i], offset: {x: offsetX, y: offsetY}, checkClickable: false});
            if (waitForLoadingDialog) {	
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();	
            }	
        }
        await elements[i-1].moveTo();
        await browser.pause(dndInnerTime);
        await elements[i-1].click({ button: 2, x: offsetX, y: offsetY  });
        await browser.pause(dndInnerTime);
    }

    /**
     * RMC on the selected header
     * @param {string} objectName - Name of the object
     * @param {string} visualizationName - Name of the visualization
     */
    async rightClickOnHeader(objectName, visualizationName) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.rightClick({ elem: objectElement, checkClickable: false });
    }

    async clickOnGridObjectHeader(objectName, visualizationName) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.moveAndClickByOffsetFromElement(objectElement, 1, 1);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Click the grid cells by applying the offset,
     * usually needed when selecting the cells in column headers, or selection the grid cells in both rows and columns
     * @param {string} objectNames - Names of the grid cells
     * @param {string} visualizationName - Name of the visualization
     */
    async clickOnMultiGridCellByOffSet(objectNames, visualizationName) {
        let arrString = objectNames.split(', ');
        let arrElements = [];
        let el;
        for (let i = 0; i < arrString.length; i++) {
            el = await this.getGridObject(arrString[i], visualizationName);
            await arrElements.push(el);
        }
        await this.moveAndClickByOffsetFromMultiElements(arrElements, 1, 1);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Open the Format RMC tool box from column header
     * @param {string} objectName - Name of the object header
     * @param {string }visualizationName - Name of the visualization
     */
    async openFormatToolBoxFromColumnHeader(objectName, visualizationName) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.rightClick({ elem: objectElement, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption('Format') });
        await this.waitForElementVisible(this.toolBox);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    /**
     * Open the Format RMC tool box from visualization title
     * @param {string} visualizationName - Name of the visualization
     */
    async openFormatToolBoxFromVisualizationTitle(visualizationName) {
        let objectElement = this.getContainerTitlebar(visualizationName);
        await this.rightClick({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption('Format') });
        await this.waitForElementVisible(this.toolBox);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async expandOutlineFromColumnHeader(objectName, visualizationName) {
        const objectElement = await this.getGridObjectExpand(objectName, visualizationName);
        await this.waitForElementVisible(objectElement);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the expand icon
        await this.clickOnElementByInjectingScript(objectElement);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async collapseOutlineFromColumnHeader(objectName, visualizationName) {
        const objectElement = await this.getGridObjectCollapse(objectName, visualizationName);
        await this.waitForElementVisible(objectElement);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the collapse icon
        await this.clickOnElementByInjectingScript(objectElement);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async confirmOutlineGridCollapsed(objectName, visualizationName) {
        let collapsedIcon = await this.getGridObjectExpand(objectName, visualizationName);
        return await collapsedIcon.isDisplayed();
    }

    async confirmOutlineGridExpanded(objectName, visualizationName) {
        let expandedIcon = await this.getGridObjectCollapse(objectName, visualizationName);
        return await expandedIcon.isDisplayed();
    }

    /**
     * Open the Format RMC tool box from element of the object
     * @param {string} objectName - Name of the object header
     * @param {string} visualizationName - Name of the visualization
     */

    async openFormatToolBoxFromElement(objectName, visualizationName) {
        let objectElement = await this.getGridObject(objectName, visualizationName);
        await this.rightClick({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption('Format') });
        await this.waitForElementVisible(this.toolBox);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    /**
     * GENERIC CONTEXT MENU FUNCTIONS
     */

    /**
     * Check if a context menu item exists
     * @param option
     */
    async existContextMenuItemByName(option) {
        let objectElement = await this.getContextMenuOption(option);
        let isPresent = await objectElement.isDisplayed();
        return isPresent;
    }
    /**
     * Selects option from context menu after RMC on a single element/header in grid
     * @param {string} objectName - Name of the object header or element
     * @param {string} option - Format, Number Format, Etc.
     * @param {string} visualizationName - Name of the visualization
     */

    async selectContextMenuOptionFromElement(objectName, option, visualizationName) {
        await this.rightClick({ elem: await this.getGridObject(objectName, visualizationName), checkClickable: false });
        await this.click({ elem: this.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectContextMenuOptionFromElementByIndex(rowIndex, colIndex, option, visualizationName) {
        let el = await this.getGridCellByPosition(rowIndex, colIndex, visualizationName);
        await this.rightClick({ elem: el, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Selects option from context menu after RMC on a single element/header with hyper link in grid
     * @param {string} objectName - Name of the object header or element
     * @param {string} option - Format, Number Format, Etc.
     * @param {string} visualizationName - Name of the visualization
     */

    async selectContextMenuOptionFromElementWithHyperLink(objectName, option, visualizationName) {
        await this.rightClick({ elem: await this.getGridObjectWithHyperLink(objectName, visualizationName) });
        await this.click({ elem: this.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Selects option from context menu after RMC on a single object in dropzone
     * @param {string} objectName - Name of the object header
     * @param {string} desZone - dropzone
     * @param {string} option - Format, Number Format, Etc.
     */

    async selectContextMenuOptionFromObjectinDZ(objectName, desZone, option) {
        await this.rightClick({ elem: await this.getObjectInDropZone(objectName, desZone) });
        await this.click({ elem: this.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Click any of the generic buttons in opened context menu
     * @param {*} button OK or Cancel
     */
    async clickContextMenuButton(button) {
        await this.clickOnElementByInjectingScript(await this.common.getContextMenuButton(button));
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * NUMBER FORMAT SPECIFIC FUNCTIONS
     */
    /**
     * Click one of the 3 icons in Number Format context menu
     * @param {*} shortcut ',' '$' '%' or fixed, currency, percentage
     */
    async clickNfShortcutIcon(shortcut) {
        let shortcutText;
        switch (shortcut) {
            case ',':
                shortcutText = 'fixed';
                break;
            case '$':
                shortcutText = 'currency';
                break;
            case '%':
                shortcutText = 'percentage';
                break;
            default:
                // can still use word version instead of icon if given something
                shortcutText = shortcut && shortcut.toLowerCase();
        }
        await this.click({ elem: await this.getNfShortcutsIcon(shortcutText) });
    }

    /**
     * Changes current number format by selecting another from the drop down
     * @param {*} numberFormat (from the dropdown) Automatic, Fixed, Currency, Percentage, etc..
     */
    async selectNumberFormatFromDropdown(numberFormat) {
        await this.sleep(0.3);
        await this.click({ elem: await this.getNfCategoryPulldown() });
        let pulldownOption = await this.common.getPopupListItem(numberFormat);
        // make sure pulldown is opened
        await this.waitForElementVisible(pulldownOption);
        await this.click({ elem: pulldownOption });
    }

    async clickNumberFormatDropdownOption() {
        await this.sleep(0.3);
        await this.click({ elem: await this.getNfCategoryPulldown() });
    }

    /**
     * Changes the currency used after selecting the Currency Number Format
     * @param {*} symbol $, €
     */
    async selectNfCurrencySymbolFromDropdown(symbol) {
        await this.click({ elem: await this.getNfCurrencySymbolPulldown() });
        let pulldownOption = await this.common.getPopupListItem(symbol);
        // make sure pulldown is opened
        await this.waitForElementVisible(pulldownOption);
        await this.click({ elem: pulldownOption });
    }

    /**
     * Changes where the currency is positioned after selecting the Currency Number Format
     * @param {*} position Left, Right, Left with space, Right with space
     */
    async selectNfCurrencyPositionFromDropdown(position) {
        await this.moveToPosition({ x: 0, y: 0 });
        await this.click({ elem: await this.getNfCurrencyPositionPulldown() });
        let pulldownOption = await this.common.getPopupListItem(position);
        // make sure pulldown is opened
        await this.waitForElementVisible(pulldownOption);
        await this.click({ elem: pulldownOption });
    }

    /**
     * Exra pulldown to configure how the value is formatted for Date, Time, and Fraction Number Formats
     * @param {*} format
     */
    async selectNfValueFormatFromDropdown(format) {
        await this.click({ elem: await this.getNfValueFormatPulldown() });
        // make sure pulldown is opened
        let pulldownOption = await this.common.getPopupListItem(format);
        await this.waitForElementVisible(pulldownOption);
        //await this.scrollIntoView(pulldownOption);
        await this.clickOnElement(pulldownOption);
    }

    /**
     * For Custom Number Format, will automatically condense value. For ex: 4,000,000 to 4M
     */
    async clickNfCondense() {
        await this.click({ elem: await this.getNfCondenseButton() });
    }

    async replaceText({ elem, text }) {
        await this.click({ elem });
        await this.ctrlA();
        await this.delete();
        await elem.setValue(text);
        await this.sleep(500);
        await this.enter();
    }

    async inputNfCustomTextBox(newFormat) {
        await this.replaceText({ elem: await this.getNfCustomTextbox(), text: newFormat });
    }

    /**
     * For Fixed number format, if wanted to enable or disable 1000 separator
     */
    async toggleNfThousandSeparator() {
        await this.click({ elem: await this.getNfThousandSeparator() });
    }

    /**
     * For Fixed, Currency, and Percentage
     * @param {*} form (1,234) or 1,234
     * @param {*} inRed boolean
     */
    async selectNfNegativeForm(form, inRed) {
        await this.click({ elem: await this.getNfNegativePulldown() });
        // make sure pulldown is opened
        let pulldownOption = await this.getNfNegativePopupListItem(form, inRed);
        await this.waitForElementVisible(pulldownOption);
        await this.click({ elem: pulldownOption });
    }

    /**
     * Function to increase or decrease the number of decimal places shown
     * @param {*} change increaes or decrease
     * @param {*} numOfPlaces >= 0
     */
    async moveNfDecimalPlace(change, numOfPlaces) {
        let direction = change.toLowerCase() === 'increase' ? 'left' : 'right',
            element = await this.getNfDecimalMoverBtn(direction),
            numOfClicks = parseInt(numOfPlaces);

        for (let i = 0; i < numOfClicks; i++) {
            await this.click({ elem: element });
        }
    }

    /**
     * Open Calculation Editor
     * @param {string} metricName - Column header which is metric not attribute
     * @param {string} visualizationName - Name of the visualization			T
     */
    async openCalculationEditor(metricName, visualizationName) {
        let objectElement = await this.getGridObject(metricName, visualizationName);
        await this.rightClick({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption('Calculation') });
    }

    /**
     * Open Threshold Editor
     * @param {string} metricName - Column header which is metric not attribute
     * @param {string} visualizationName - Name of the visualization			T
     */
    async openThresholdEditor(metricName, visualizationName) {
        let objectElement = await this.getGridObject(metricName, visualizationName);
        await this.rightClick({ elem: objectElement, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption('Thresholds...') });
    }

    /**
     * click on the context menu for the viz to open the show data window
     * @param {string} visualizationName - Name of the visualization
     */
    async openShowDataDiagFromViz(visualizationName) {
        await this.resetContextMenuButton(visualizationName);
        let visualizationContextMenuButton = await this.getContainerContextMenuButton(visualizationName);
        await this.click({ elem: visualizationContextMenuButton });
        let contextOption = await this.getContextMenuOption(visualizationContextMenuItem.SHOW_DATA);
        await this.click({ elem: contextOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async openMoreOptionDiagFromViz(visualizationName) {
        await this.resetContextMenuButton(visualizationName);
        let visualizationContextMenuButton = await this.getContainerContextMenuButton(visualizationName);
        await this.click({ elem: visualizationContextMenuButton });
        let contextOption = await this.getContextMenuOption(visualizationContextMenuItem.MORE_OPTIONS);
        await this.click({ elem: contextOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async deleteViz(visualizationName) {
        await this.resetContextMenuButton(visualizationName);
        let visualizationContextMenuButton = await this.getContainerContextMenuButton(visualizationName);
        await this.click({ elem: visualizationContextMenuButton });
        let contextOption = await this.getContextMenuOption(visualizationContextMenuItem.DELETE);
        await this.click({ elem: contextOption });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Set grid source from visualization item context menu
     * @param {string} visualizationName - Name of the visualization
     * @param {string} gridSourceName - Type of grid source to be selected
     */
    async setDataSource(visualizationName, gridSourceName) {
        let objectElement = await this.getContainerContextMenuButton(visualizationName);
        let cntxt = await this.common.getSecondaryContextMenu(gridSourceName);
        await this.click({ elem: objectElement });
        await this.click({ elem: this.getContextMenuOption('Data Source') });
        await this.click({ elem: cntxt });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Set compound or AG grid source from visualization item context menu
     * @param {string} visualizationName - Name of the visualization
     * @param {string} gridSourceName - Type of grid source to be selected
     */
    async setDataSourceForCompoundOrAg(containerName, columnSet, dataSource) {
        await this.openContextMenu(containerName);
        let dataSourceMenu = await this.getContextMenuOption('Data Source');
        await this.click({ elem: dataSourceMenu });

        let columnSetOption = await this.getContextMenuOption(columnSet);
        await this.waitForElementVisible(columnSetOption);
        await this.click({ elem: columnSetOption });

        let dsOption = await await this.getContextMenuOption(dataSource);
        await this.waitForElementVisible(columnSetOption);
        await this.click({ elem: dsOption });
    }

    /**
     * Gets the element of a given data source option
     * for the provided grid visualization.
     *
     * @param {string} gridName
     * @param {string} dataSource
     */
    async getDataSourceOption(gridName, dataSource) {
        await this.openContextMenu(gridName);
        const dataSourceSubMenu = this.getContextMenuOption('Data Source');
        await this.waitForElementVisible(dataSourceSubMenu, 3 * 1000);
        await this.clickOnElement(dataSourceSubMenu);
        const ctxMenuOption = this.common.getSecondaryContextMenu(dataSource);
        await this.waitForElementVisible(ctxMenuOption, 3 * 1000);
        return ctxMenuOption.$('./parent::a');
    }

    /**
     * Gets the element of a given data source option
     * for the provided compound/ag grid visualization.
     *
     * @param {string} gridName
     * @param {string} dataSource
     */
    async getDataSourceOptionForCompoundOrAg(containerName, columnSet, dataSource) {
        await this.openContextMenu(containerName);
        let dataSourceMenu = await this.getContextMenuOption('Data Source');
        await this.click({ elem: dataSourceMenu });

        let columnSetOption = await this.getContextMenuOption(columnSet);
        await this.waitForElementVisible(columnSetOption);
        await this.click({ elem: columnSetOption });

        let dsOption = await this.getContextMenuOption(dataSource);
        return dsOption.$('./parent::a');
    }

    /**
     * Click to select Visualization
     * @param {string} visualizationName - Name of the visualization
     */
    async selectVizContainer(visualizationName) {
        let objectElement = await this.getContainerContextMenuButton(visualizationName);
        await this.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    async expandOutlineFromElement(elementName, visualizationName) {
        const objectElement = await this.getGridElementExpand(elementName, visualizationName);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the expand icon
        await this.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async collapseOutlineFromElement(elementName, visualizationName) {
        const objectElement = await this.getGridElementCollapse(elementName, visualizationName);
        // We can't use a direct clickOnElement here due to the
        // use of a pseudo-selector on the collapse icon
        await this.click({ elem: objectElement });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    /**
     * Action to select(single or multiple) element(s) in grid, by calling the method selectMultipleElements
     * @param {string} elements     the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     */
    async selectMultipleElements(elements, visualizationName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            arrElements.push(await this.getGridElement(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements, true);
    }

    //not function well, need improve later
    async selectMultipleGridCells(elements, visualizationName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElement(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async selectMultipleEncodedGridCells(elements, visualizationName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getEncodedGridCell(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Action to select(single or multiple) element(s) in grid, by calling the method selectMultipleElements
     * @param {string} elements     the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     */
    async selectMultipleElementsWithHyperLink(elements, objectName, visualizationName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElementWithHyperLink(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
    }
    /**
     * Action to select(multiple) elements in grid by partial value
     * @param {string} elementsPartialValue     Elements partial value. For e.g in case of Bangladesh. If I select "Ba"
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     */
    async selectMultipleElementsByPartialValue(elementPartialValue, objectName, visualizationName) {
        let elementArray = [];
        await this.getElementByPartialValueByViz(visualizationName, elementPartialValue).each(function (el, index) {
            elementArray.push($(`(${el.locator().value})[${index + 1}]`));
        });
        await this.multiSelectElementsUsingCommandOrControl(elementArray);
    }

    /**
     * Action to clear(single or multiple) element(s) in grid, by calling the method selectMultipleElements
     * @param {string} elements     the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     */
    async clearMultipleElements(elements, objectName, visualizationName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElement(arrString[i], visualizationName));
        }
        //var arrElements = newArr.push(this.getGridElement(arrString, visualizationName));
        //let arrElements = await arrString.map(function(objectName, visualizationName) {return getObjectLocator(objectName, visualizationName)});
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
    }

    /**
     * Action to select(multiple) element(s) in grid using shift key
     * @param {string} elements     the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     */
    async selectElementsUsingShift(elements_1, elements_2, visualizationName) {
        let obj1 = await this.getGridElement(elements_1, visualizationName);
        let obj2 = await this.getGridElement(elements_2, visualizationName);
        await this.multiSelectElementsUsingShift(obj1, obj2);
    }

    /**
     * To check whether element is present or not
     * @param {string} elements     the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @returns {Promise<boolean>}
     */
    async isElementPresent(element, objectName, visualizationName) {
        let objectElement = await this.getGridObject(visualizationName, element);
        await this.waitForElementVisible(objectElement);
        return objectElement.isDisplayed();
    }

    /**
     * Create a group with the selected elements
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async groupElements(elements, objectName, visualizationName, groupName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElement(arrString[i], visualizationName));
        }
        await this.groupElementsHelper(arrElements, groupName);
    }

    /**
     * Create a group for RA-MDX
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async groupElements2(elements, objectName, visualizationName, groupName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElement2(arrString[i], visualizationName));
        }
        await this.groupElementsHelper(arrElements, groupName);
    }

    /**
     * Input a value in the rename editor
     * @param {*} newName new name. Otherwise, just use the default
     */
    async inputFieldRenameHelper(newName) {
        // rename if given, else use default
        if (newName) {
            let el = await this.inputFieldFromRenameEditor;
            await this.renameTextField(newName);
        }
        let saveBtn = this.saveButtonFromRenameEditor;
        await this.click({ elem: saveBtn });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Helper function for grouping that can also be used by agGrid
     * @param {*} arrElements Array of elements (cells) to group
     * @param {*} groupName default is Group 1 if none passed
     */
    async groupElementsHelper(arrElements, groupName) {
        await this.moveAndClickByOffsetFromMultiElements({ elements: arrElements });
        await this.rightClick({ elem: arrElements[0] });
        let group = this.common.getContextMenuItem('Group');
        await this.waitForElementVisible(group);
        await this.click({ elem: group });
        await this.inputFieldRenameHelper(groupName);
    }

    /**
     * Helper function for creating a calculation on cells that can also be used by agGrid
     * @param {Array<String> | String} arrElements Array of elements (cells) to group
     * @param {String} calculation Type of calculation to apply
     * @param {String} calculationName default to Caclulation 1 if none passed
     */
    async calculationElementsHelper(arrElements, calculation, calculationName) {
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.rightClick({ elem: arrElements[0] });
        await this.clickOnElementByInjectingScript(common.getContextMenuItem('Calculation'));
        await this.clickOnElementByInjectingScript(common.getContextMenuItem(calculation));
        await this.inputFieldRenameHelper(calculationName);
    }

    /**
     * Create a group with the selected elements by partial value
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async groupElementsByPartialValue(elementPartialValue, objectName, visualizationName, groupName) {
        let obj1 = await this.getElementByPartialValueByViz(visualizationName, elementPartialValue);
        await this.multiSelectElementsUsingCommandOrControl(obj1);
        await this.rightClick({ elem: obj1[0] });
        await this.click({ elem: this.getContextMenuOption('Group') });
        await this.inputFieldFromRenameEditor.clear();
        await this.setValue(groupName, this.inputFieldFromRenameEditor);
        await this.click({ elem: this.saveButtonFromRenameEditor });
    }

    /**
     * Create a group with the selected elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async ungroupElements(objectName, visualizationName, groupName) {
        let selectElementGroup = await this.getGridObject(groupName, visualizationName);
        await this.rightClick({ elem: selectElementGroup });
        await this.click({ elem: this.getContextMenuOption('Ungroup') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Upgroup a group that is in outline mode (group for RA-MDX)
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     */
    async ungroupElements2(objectName, visualizationName, groupName) {
        let selectElementGroup = await this.getGridElement2(groupName, visualizationName);
        await this.rightClick({ elem: selectElementGroup });
        await this.click({ elem: this.getContextMenuOption('Ungroup') });
    }

    /**
     * Create a group with the selected elements
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     * @param {string} calculationMenu Calculation menu for "add, average, greatest, least"
     */
    async groupElementsForCalculation(elements, objectName, visualizationName, groupName, calculationMenu) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElement(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.rightClick({ elem: arrElements[0] });
        await this.click({ elem: this.getContextMenuOption('Calculation') });
        await this.click({ elem: this.common.getSecondaryContextMenu(calculationMenu) });
        let inputField = await this.inputFieldFromRenameEditor;
        await this.clear(inputField);
        await inputField.setValue(groupName);
        await this.click({ elem: this.saveButtonFromRenameEditor });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addElementsToExistingGroup(elements, objectName, visualizationName, groupName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElement(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.rightClick({ elem: arrElements[0] });
        await this.click({ elem: this.getContextMenuOption('Add to Group') });
        await this.click({ elem: this.common.getSecondaryContextMenu(groupName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Create a group with the selected elements by partial value for calculation
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     * @param {string} groupName        the group name
     * @param {string} calculationMenu Calculation menu for "add, average, greatest, least"
     */
    async groupElementsByPartialValueForCalculation(elementPartialValue, objectName, visualizationName, groupName) {
        let obj1 = await this.getElementByPartialValueByViz(visualizationName, elementPartialValue);
        await this.multiSelectElementsUsingCommandOrControl(obj1);
        await this.rightClick({ elem: obj1[0] });
        await this.click({ elem: this.getContextMenuOption('Calculation') });
        await this.click({ elem: this.common.getSecondaryContextMenu('Add') });
        await this.inputFieldFromRenameEditor.clear();
        await this.setValue(groupName, this.inputFieldFromRenameEditor);
        await this.click({ elem: this.saveButtonFromRenameEditor });
    }

    /**
     * Create a group with the selected elements
     * @param {Array} elements      the list of elements
     * @param {string} objectName   the MSTR object name
     * @param {string} visualizationName - Name of the visualization
     */
    async keepOnlyVizFilter(elements, objectName, visualizationName) {
        let arrString = elements.split(', ');
        let arrElements = [];
        for (let i = 0; i < arrString.length; i++) {
            await arrElements.push(this.getGridElement(arrString[i], visualizationName));
        }
        await this.multiSelectElementsUsingCommandOrControl(arrElements);
        await this.rightClick({ elem: arrElements[0] });
        await this.click({ elem: this.getContextMenuOption('Keep Only') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(2);
    }

    // async rightClickOnHeader(objectName, visualizationName) {
    //     let objectElement = await this.getGridObject(objectName, visualizationName);
    //     await this.rightClick(objectElement);
    // }

    /** clears the thresholds on a header by right clicking the header in the grid
     * @param {string} headerName name of the header you want to clear the thresholds
     * @param {string} visualizationName name of the visualization that contains the header
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async clearThresholds(headerName, visualizationName) {
        await this.rightClickOnHeader(headerName, visualizationName);
        await this.click({ elem: this.common.getContextMenuItem('Clear Thresholds') });
    }

    /** opens the new group dialog for an attribute through the grid
     * @param {string} attributeName name of the attribute you want to create a group for
     * @param {string} visualizationName name of the visualization that contains the attribute
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async createNewGroup(attributeName, visualizationName) {
        await this.rightClickOnHeader(attributeName, visualizationName);
        await this.click({ elem: this.common.getContextMenuItem('Create Groups...') });
    }

    /**
     * drills from the header in a grid
     * @param {string} headerName the attribute header to drill on
     * @param {string} drillToObject the level to drill down to
     * @param {string} visualizationName name of the visualization that contains the header
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async drillFromHeader(headerName, drillToObject, visualizationName, waitForLoadingDialog = true) {
        await this.rightClickOnHeader(headerName, visualizationName);
        await this.click({ elem: this.common.getContextMenuItem('Drill') });
        await this.click({ elem: this.common.getContextMenuItem(drillToObject) });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
        }
    }

    /**
     * drills from an element or elements in the grid
     * @param {string} elements elements to be clicked on, needs to be formatted as "element1,element2,etc" NO SPACES AFTER COMMAS
     * @param {string} drillToObject the level to drill down to
     * @param {string} visualizationName name of the visualization that contains the elements
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async drillFromElements(elements, drillToObject, visualizationName) {
        let elementsSplit = elements.split(',');
        let currElement = await this.getGridObject(elementsSplit[0], visualizationName);
        let elementsToClick = [currElement];
        for (let i = 1; i < elementsSplit.length; i++) {
            let currElement = await this.getGridObject(elementsSplit[i], visualizationName);
            elementsToClick.push(currElement);
        }
        await this.multiSelectElementsUsingCommandOrControl(elementsToClick);
        await this.rightClick({ elem: elementsToClick[0] });
        await this.click({ elem: this.common.getContextMenuItem('Drill') });
        await this.click({ elem: this.common.getContextMenuItem(drillToObject) });
    }

    async drillFromElement(element, drillToObject, visualizationName) {
        let currElement = await this.getGridObject(element, visualizationName);
        await this.rightClick({ elem: currElement, checkClickable: false });
        await this.click({ elem: this.common.getContextMenuItem('Drill') });
        await this.click({ elem: this.common.getContextMenuItem(drillToObject) });
    }

    /**
     * enable subtotals for attribute in the grid
     * @param {string} objectName
     * @param {string} visualizationName - Name of the visualization
     * @param {String} subtotalOptions - options available in Show Totals submenu
     */
    async toggleShowTotalsFromAttribute(objectName, visualizationName, subtotalOptions, waitForLoadingDialog = true) {
        let subtotalSplit = subtotalOptions.split(',');
        let el = await this.getObjectHeader(objectName, visualizationName);
        await this.waitForElementVisible(el);
        await this.rightClick({ elem: el, checkClickable: false });

        // wait for menu to appear
        let menu = await this.getContextMenuOption(visualizationContextMenuItem.SHOW_TOTALS);
        await this.waitForElementVisible(menu);
        await this.click({ elem: menu });

        for (let i = 0; i < subtotalSplit.length; i++) {
            let cntxt = await this.getSecondaryContextMenu(subtotalSplit[i]);
            await this.click({ elem: cntxt });
        }
        await this.click({
            elem: $("//div[contains(@class,'mstrmojo-ui-MenuPopup') and contains(@style,'block')]//div[text()='OK']"),
        });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
        await this.waitForElementVisible(await this.getGridElement(subtotalSplit[0], visualizationName));
    }

    /**
     * enable subtotals for metric in the grid
     * @param {string} objectName
     * @param {string} visualizationName - Name of the visualization
     */
    async toggleShowTotalsFromMetric(objectName, visualizationName, waitForLoadingDialog = true) {
        let el = await this.getObjectHeader(objectName, visualizationName);
        await this.rightClick({ elem: el, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption(visualizationContextMenuItem.SHOW_TOTALS) });
        if (waitForLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    async renameVisualizationByContextMenu(visualizationName, newvisualizationName) {
        let el = await this.getContainerContextMenuButton(visualizationName);
        await this.click({ elem: el, checkClickable: false });
        await this.click({ elem: this.getContextMenuOption(visualizationContextMenuItem.RENAME) });
        await this.datasetPanel.renameTextField(newvisualizationName);
    }

    async renameVisualizationByDoubleClick(visualizationName, newVisualizationName) {
        // Get the visualization title bar element
        let visualizationToRename = this.getVisualizationTitleBarTextArea(visualizationName);
        // Pull the element by its ID since the text will be changing
        const visId = await visualizationToRename.getAttribute('id');
        visualizationToRename = await $(`#${visId}`);
        // Clear the existing text
        await visualizationToRename.doubleClick();
        await browser.keys(['Control', 'a']); // Select all text
        await browser.keys('Backspace');

        await browser.execute('arguments[0].innerText = arguments[1];', visualizationToRename, newVisualizationName);
        await browser.keys('Enter'); // Simulate pressing the ENTER key
        // Wait for the loading dialog to disappear
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * RMC on cell to change where subtotals are positioned
     * @param {string} cellToClick "Total, Average, Minimun, etc"
     * @param {string} newPosition "Move to top, bottom, left, right"
     * @param {string} visualizationName - Name of the visualization
     */
    async changeSubtotalPosition(cellToClick, newPosition, visualizationName) {
        let el = await this.getGridElement(cellToClick, visualizationName);
        await this.rightClick({ elem: el });
        await this.click({ elem: this.getContextMenuOption(newPosition) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * edits a calculation group by changing the operation type, this is for calculation groups made under attributes not metrics
     * @param {string} newCalculation the new calculation to be used for the calculation group
     * @param {string} groupName the name of the group/object that is going to be edited
     * @param {string} visualizationName name of the visualization that contains the group
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async editCalculationGroup(newCalculation, groupName, visualizationName) {
        await this.rightClick({ elem: this.getGridObject(groupName, visualizationName) });
        await this.click({ elem: this.common.getContextMenuItem('Edit Calculation') });
        await this.click({ elem: this.common.getSecondaryContextMenu(newCalculation) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * delete a calculation group , this is for calculation groups made under attributes not metrics
     * @param {string} groupName the name of the group/object that is going to be edited
     * @param {string} visualizationName name of the visualization that contains the group
     * @author fsuo
     */
    async deleteCalculationGroup(groupName, visualizationName) {
        await this.rightClick({ elem: this.getGridObject(groupName, visualizationName) });
        await this.click({ elem: this.common.getContextMenuItem('Delete Calculation') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
    }

    /**
     * edits an attribute group by opening the group editor for a single group in the grid
     * @param {string} groupName the name of the group/object that is going to be edited
     * @param {string} visualizationName name of the visualization that contains the group
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async editGroup(groupName, visualizationName) {
        await this.rightClick({ elem: this.getGridObject(groupName, visualizationName) });
        await this.click({ elem: this.common.getContextMenuItem('Edit Group...') });
    }

    /**
     * opens the group editor for all groups under a specific header
     * @param {string} headerName
     * @param {string} visualizationName
     */
    async editHeaderGroups(headerName, visualizationName) {
        await this.rightClickOnHeader(headerName, visualizationName);
        await this.click({ elem: this.common.getContextMenuItem('Edit Groups...') });
    }

    /**
     * rename a group from the grid
     * @param {string} groupName name of the group you want to rename
     * @param {string} visualizationName name of the visualization that contains the group
     * @param {string} newGroupName new name for the group
     */
    async renameGroup(groupName, visualizationName, newGroupName) {
        await this.rightClick({ elem: this.getGridObject(groupName, visualizationName) });
        await this.click({ elem: this.common.getContextMenuItem('Rename...') });
        let txtBox = this.$(
            `//div[@id='mstrmojo-renameDerivedElement']//div[@class='mstrmojo-vi-TwoColumnProp']//input[@title='']`
        );
        await this.click({ elem: txtBox });
        // await this.clearTextByBackSpace();
        // await this.clearTextFromBox(txtBox);
        for (let i = 0; i < groupName.length; i++) {
            await browser.keys(Key.Backspace);
        }
        await txtBox.setValue(newGroupName);
        await this.click({ elem: $(`//div[@id='mstrmojo-renameDerivedElement']//div[@title='']/div[.='Save']`) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * excludes some elements by multi selecting a list of them, right clicking on the selection, then choosing the Exclude option
     * @param {string} elements the list of elements that you want to be excluded, needs to be formatted as "element1,element2,etc" NO SPACES AFTER COMMAS
     * @param {string} visualizationName the name of the visualization that contains the elements
     */
    async excludeElements(elements, visualizationName) {
        let elementsSplit = elements.split(', ');
        let currElement = await this.getGridObject(elementsSplit[0], visualizationName);
        let elementsToClick = [currElement];
        for (let i = 1; i < elementsSplit.length; i++) {
            let currElement = await this.getGridObject(elementsSplit[i], visualizationName);
            elementsToClick.push(currElement);
        }
        await this.multiSelectElementsUsingCommandOrControl(elementsToClick);
        await this.rightClick({ elem: elementsToClick[0] });
        await this.click({ elem: this.common.getContextMenuItem('Exclude') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async keepOnlyElements(elements, visualizationName) {
        let elementsSplit = elements.split(', ');
        let currElement = await this.getGridObject(elementsSplit[0], visualizationName);
        let elementsToClick = [currElement];
        for (let i = 1; i < elementsSplit.length; i++) {
            let currElement = await this.getGridObject(elementsSplit[i], visualizationName);
            elementsToClick.push(currElement);
        }
        await this.multiSelectElementsUsingCommandOrControl(elementsToClick);
        await this.rightClick({ elem: elementsToClick[0] });
        await this.click({ elem: this.common.getContextMenuItem('Keep Only') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * clear the drill conditions on a visualization by clicking the filter button then selecting to clear conditions
     * @param {string} visualizationName name of the visualization whos drill conditions you want to clear
     */
    //Need more information on drilling behavior, will return to this after user differences are resolved
    //async clearDrillConditions(visualizationName) {
    //    await this.clickOnElementByInjectingScript(element(by.xpath(`//div[@class='mstrmojo-VIDocLayout']//div[contains(@class, 'mstrmojo-VITitleBar') and .//div[text()='${visualizationName}']]/../../div[contains(@class,'hover-filter-btn')]`)));
    //    await this.clickOnElementByInjectingScript(element(by.xpath(`//div[@class='mstrmojo-ui-Menu-item-container']//a[@class='item mstrmojo-ui-Menu-item ']//div[@class='mtxt' and text()='Clear drill conditions']`)));
    //}

    //VALIDATIONS

    /**
     * verifies if the save button in Rename dialog is disabled or not
     * @returns {Promise<boolean>} true if save button is disabled or grayed out
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async isSaveDisabledForHeaderRename() {
        let saveButton = this.$(
            `//body/div[@class='mstrmojo-Editor-wrapper mojo-theme-light']/div[@class='mstrmojo-Editor mstrmojo-rename-editor modal']/div[@class='mstrmojo-Editor-buttons']//div[@class='mstrmojo-Button mstrmojo-WebButton hot mstrmojo-Editor-button mstrmojo-Editor-button disabled']`
        );
        await this.waitForElementVisible(saveButton);
        return saveButton.isDisplayed();
    }

    /**
     * verifies if the group editor is open
     * @returns {Promise<boolean>} true if the group editor is present on screen
     * @author Eduardo Alcazar-Bustillos <ebustillos@microstrategy.com>
     */
    async isGroupEditorOpen() {
        let groupEditor = this.$(
            `//div[@id='mstrmojo-derivedElements']//div[@class='mstrmojo-Editor-title-container']//div[contains(text(), 'Group') and contains(text(), 'Editor')]/../..//div[@class='mstrmojo-VIGroupDERow new']`
        );
        await this.waitForElementVisible(groupEditor);
        return groupEditor.isDisplayed();
    }

    /**
     * verifies if the group editor is open for a specific group
     * As in, if you right click a group in the grid and select "Edit Group"
     * or if you opened the group editor from the header then selected a specific group
     * @param {string} groupName name of the group you want the editor to be open for
     * @returns {Promise<boolean>} true if the editor is opened for the specific group
     * @author Eduardo Alcazar-Bustills <ebustillos@microstrategy.com>
     */
    async isGroupEditorOpenForSpecificGroup(groupName) {
        let groupEditor = this.$(
            `//div[@id='mstrmojo-derivedElements']/div[@class='mstrmojo-Editor mstrmojo-DerivedElementsEditor modal' and contains(@style, 'display: block')]//div[starts-with(@class, 'mstrmojo-VIGroupDERow new') and contains(@class,'isEdit')]//div[@class='mstrmojo-EditableLabel mstrmojo-new-DEName hasEditableText' and text()='${groupName}']`
        );
        await this.waitForElementVisible(groupEditor);
        return groupEditor.isDisplayed();
    }

    /**
     * verifies that a header has no thresholds applied
     * @param {string} headerName header you want to verify has no thresholds
     * @param {string} visualizationName visualization that contains the header you're checking
     * @returns {Promise<boolean>} should return false because if there are no thresholds applied then "Clear Thresholds" shouldn't appear in the header menu
     */
    async noThresholdsPresentOnObject(headerName, visualizationName) {
        await this.rightClickOnHeader(headerName, visualizationName);
        await this.sleep(1.5);
        return this.common.getContextMenuItem('Clear Thresholds').isDisplayed();
    }

    async addColumnSet() {
        await this.click({ elem: this.addColumnSetIcon });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag and drop object from dataset to grid container
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} vizName - name of visualization
     */
    async dragDSObjectToGridContainer(objectName, objectTypeName, datasetName, vizName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel = await this.getGridContainer(vizName);
        await this.waitForElementVisible(desel);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag and drop object from dataset to grid dropzone
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} desZone - name of dropzone, e.g. Rows, Columns...
     */
    async dragDSObjectToGridDZ(objectName, objectTypeName, datasetName, desZone) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        // await this.scrollIntoView(srcel);
        let desel = await this.getDropZone(desZone);
        await this.waitForElementVisible(desel);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag and drop object from dataset to compound grid column set dropzone
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} columnSetName - name of column set
     */
    async dragDSObjectToGridColumnSetDZ(objectName, objectTypeName, datasetName, columnSetName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel = await this.getColumnSetDropZone(columnSetName);
        await this.waitForElementVisible(desel);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Drag and drop object from dataset to compound grid column set dropzone, and put the object "above" or "below" existing object
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} columnSetName - name of column set
     * @param {string} desPosition - "above" or "below"
     * @param {string} desObject - the existing object in the column set which is used as an reference of the relative position
     */
    async dragDSObjectToColumnSetDZwithPosition(
        objectName,
        objectTypeName,
        datasetName,
        columnSet,
        desPosition,
        desObject
    ) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel;
        if (desObject) {
            desel = await this.getObjectInColumnSetDropZone(desObject, columnSet);
        } else {
            desel = await this.getColumnSetDropZone(columnSet);
        }
        await this.waitForElementVisible(desel);
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
    }

    /**
     * Drag and drop object from dataset to compound grid microchart dropzone
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} microchartName - name of column set
     */
    async dragDSObjectToGridMicrochartDZ(objectName, objectTypeName, datasetName, microchartName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel = await this.getMicrochartDropZone(microchartName);
        await this.waitForElementVisible(desel);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: desel,
            toOffset: { x: 0, y: 5 },
        });
    }

    /**
     * Drag and drop object from dataset to compound grid microchart dropzone, and put the object "above" or "below" existing object
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} microchartName - name of column set
     * @param {string} desPosition - "above" or "below"
     * @param {string} desObject - the existing object in the column set which is used as an reference of the relative position
     */
    async dragDSObjectToMicrochartDZwithPosition(
        objectName,
        objectTypeName,
        datasetName,
        microchartName,
        desPosition,
        desObject
    ) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel;
        if (desObject) {
            desel = await this.getObjectInMicrochartDropZone(desObject, microchartName);
        } else {
            desel = await this.getMicrochartDropZone(microchartName);
        }
        await this.waitForElementVisible(desel);
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag and drop object from dataset to any visualization drop zone, and put the object "above" or "below" existing object
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} zone - name of drop zone
     * @param {string} desPosition - "above" or "below" or "replace"
     * @param {string} desObject - the existing object in the column set which is used as an reference of the relative position
     */
    async dragDSObjectToDZwithPosition(
        objectName,
        objectTypeName,
        datasetName,
        zone,
        desPosition,
        desObject,
        offsetX = 0,
        offsetY = 10
    ) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel, { timeout: 5000 });
        let desel = await this.getObjectInDropZone(desObject, zone);
        await this.waitForElementVisible(desel, { timeout: 5000 });
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel, offsetX, offsetY);
    }

    /**
     * Drag and drop object from dataset to any visualization drop zone, and put the object "above" or "below" existing object
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} zone - name of drop zone
     * @param {string} desPosition - "above" or "below"
     * @param {string} desObject - the existing object in the column set which is used as an reference of the relative position
     */
    async dragDSObjectBetweenColumnSetwithPosition(objectName, objectTypeName, datasetName, columnSet, desPosition) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel = await this.getColumnSetEndInEditorPanel(columnSet);
        if (desPosition === 'above') desel = await this.getColumnSetInEditorPanel(columnSet);
        await this.waitForElementVisible(desel);
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel);
    }

    /**
     * Drag and drop object from dataset to any visualization drop zone, and put the object "above" or "below" existing object
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} zone - name of drop zone
     * @param {string} desPosition - "above" or "below"
     * @param {string} desObject - the existing object in the column set which is used as an reference of the relative position
     */
    async dragDSObjectBelowColumnsTitleBar(objectName, objectTypeName, datasetName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel = await this.getColumnsSectionTileBar();
        await this.waitForElementVisible(desel);
        await this.moveToSpecificLocationAndWait('below', srcel, desel);
    }

    async dragDSObjectToLastColumnSet(objectName, objectTypeName, datasetName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let desel = await this.getColumnsSectionSplitter();
        await this.waitForElementExsiting(desel);
        await this.moveToSpecificLocationAndWait('above', srcel, desel, 0, -2);
    }

    async reOrderObjectsInColumnSet(
        objectTypeName1,
        objectName1,
        columnSet1,
        objectTypeName2,
        objectName2,
        columnSet2,
        desPosition
    ) {
        let srcel = await this.getObjectInColumnSetDropZone(objectName1, columnSet1);
        await this.waitForElementVisible(srcel);
        let desel = await this.getObjectInColumnSetDropZone(objectName2, columnSet2);
        await this.waitForElementVisible(desel);
        await this.moveToSpecificLocationAndWait(desPosition, srcel, desel);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Used to move multiple objects from dataset panel to grid drop zone
     * @param {*} datasetName
     * @param {*} objOneType attribute/metric of head el
     * @param {*} objOneName head el
     * @param {*} objTwoType attribute/metric of tail el
     * @param {*} objTwoName tail el
     * @param {*} destZone
     */
    async multiselectAndDragDSObjectsToDZ(datasetName, objOneType, objOneName, objTwoType, objTwoName, desZone) {
        await this.datasetPanel.switchDatasetsTab();
        let headEl = await this.datasetPanel.getObjectFromDataset(objOneName, objOneType, datasetName);
        await this.waitForElementVisible(headEl);

        let tailEl = await this.datasetPanel.getObjectFromDataset(objTwoName, objTwoType, datasetName);
        await this.waitForElementVisible(tailEl);

        let desEl = await this.getDropZone(desZone);
        await this.waitForElementVisible(desEl);

        // multiselect by shift
        await this.multiSelectElementsUsingShift(headEl, tailEl);
        await this.dragAndDrop({
            fromElem: headEl,
            toElem: desEl,
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Used to move multiple objects from dataset panel to grid drop zone with position
     * @param {*} datasetName
     * @param {*} objOneType attribute/metric of head el
     * @param {*} objOneName
     * @param {*} objTwoType attribute/metric of tail el
     * @param {*} objTwoName
     * @param {*} desPosition above/below
     * @param {*} desObject position to drop above or below to
     * @param {*} desZone where to drop
     */
    async multiselectAndDragDSObjectsToDZWithPosition(
        datasetName,
        objOneType,
        objOneName,
        objTwoType,
        objTwoName,
        desPosition,
        desObject,
        desZone
    ) {
        await this.datasetPanel.switchDatasetsTab();
        let headEl = await this.datasetPanel.getObjectFromDataset(objOneName, objOneType, datasetName);
        await this.waitForElementVisible(headEl);

        let tailEl = await this.datasetPanel.getObjectFromDataset(objTwoName, objTwoType, datasetName);
        await this.waitForElementVisible(tailEl);

        let desEl = await ngmEditorPanel.getObjectInDropZone(desObject, desZone);
        await this.waitForElementVisible(desEl);

        // multiselect by shift and move to desired place with position
        await this.multiSelectElementsUsingShift(headEl, tailEl);
        await this.moveToSpecificLocationAndWait(desPosition, headEl, desEl);
    }

    /**
     * Should I move this to BasePage or refractor DnD function in ngmEditorPanel.js ?
     * This function does NOT assume element to move will be dropped to target element.
     * @param {*} targetElement element to drag
     * @param {*} xOffset optional param
     * @param {*} yOffset optional param
     * @param {*} doMouseUp optional param
     * @param {*} waitforLoadingDialog optional param
     */
    async baseDragFunction(movingElement, targetElement, xOffset = 0, yOffset = 0, doMouseUp, waitforLoadingDialog) {
        let dndInnerTime = 0.3 * 1000; // Allow DND animation work properly

        try {
            await browser.actions().mouseMove(movingElement).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseDown().perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 0, y: 1 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 1, y: 0 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove({ x: 1, y: 0 }).perform();
            await browser.pause(dndInnerTime);
            await browser.actions().mouseMove(targetElement).perform();
            await browser.pause(dndInnerTime);

            if (xOffset > 0 || yOffset > 0) {
                await browser
                    .actions()
                    .mouseMove({ x: parseInt(xOffset), y: parseInt(yOffset) })
                    .perform();
                await browser.pause(dndInnerTime);
            }

            if (doMouseUp) {
                await browser.actions().mouseUp().perform();
                await browser.pause(dndInnerTime);
            }
        } catch (err) {
            console.log(err.message);
        }

        if (waitforLoadingDialog) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(10);
        }
    }

    /**
     * 6 FUNCTIONS BELOW DO NOT AUTOMATICALLY DROP OBJECT IN GRID
     * Utilizes the base drag function above vs ngmEditorPanel.dragAndDropObjectAndWait()
     */

    /**
     * Drag from dataset to grid column
     * @param {*} objectName
     * @param {*} objectTypeName
     * @param {*} datasetName
     * @param {*} colNum
     * @param {*} vizName
     */
    async dragDSObjectToGridByColumnBorder(objectName, objectTypeName, datasetName, colNum, vizName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);
        let columnBorder = await this.getColumnBorder(colNum, vizName);
        await this.waitForElementVisible(columnBorder);
        const srcelPos = await this.getElementPositionOfScreen(srcel);
        const columnBorderPos = await this.getElementPositionOfScreen(columnBorder);
        const movePixels = columnBorderPos.x - srcelPos.x;
        await this.dragAndDropByPixel(srcel, movePixels, 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag object already in grid to another column
     * @param {*} objectName
     * @param {*} srcViz
     * @param {*} colNum
     * @param {*} destViz
     */
    async moveObjectToGridByColumnBorder(objectName, srcViz, colNum, destViz) {
        let srcel = await this.getGridElement(objectName, srcViz);
        await this.waitForElementVisible(srcel);

        let columnBorder = await this.getColumnBorder(colNum, destViz);
        await this.waitForElementVisible(columnBorder);
        const srcelPos = await this.getElementPositionOfScreen(srcel);
        const columnBorderPos = await this.getElementPositionOfScreen(columnBorder);
        const movePixels = columnBorderPos.x - srcelPos.x;
        await this.dragAndDropByPixel(srcel, movePixels, 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Drag object from dataset to grid by putting the object "above" or "below" existing object
     * @param {string} objectName
     * @param {string} objectTypeName - attribute or metric
     * @param {string} datasetName
     * @param {string} desPosition - "above" or "below"
     * @param {string} elementInRow - name of current elem in grid, used to trigger row move
     * @param {string} vizName
     */
    async dragDSObjectToGridWithPositionInRow(
        objectName,
        objectTypeName,
        datasetName,
        desPosition,
        elementInRow,
        vizName
    ) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementVisible(srcel);

        let row = await this.getGridElement(elementInRow, vizName);
        await this.waitForElementVisible(row);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcel,
            toElem: row,
            toOffset: { x: 0, y: desPosition === 'above' ? -14 : 14 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Move object already in grid to row "above" or "below" an existing object
     * @param {*} objectName
     * @param {*} srcViz
     * @param {*} desPosition
     * @param {*} elementInRow
     * @param {*} destViz
     */
    async moveObjectToGridWithPositionInRow(objectName, srcViz, desPosition, elementInRow, destViz) {
        let srcel = await this.getGridElement(objectName, srcViz);
        await this.waitForElementVisible(srcel);

        let row = await this.getGridElement(elementInRow, destViz);
        await this.waitForElementVisible(row);
        await this.baseDragFunction(srcel, row, 0, desPosition === 'above' ? -14 : 14);
    }

    /**
     * Invalid DZ chosen is title bar of visualization
     * @param {*} objectName
     * @param {*} vizName
     */
    async dragObjectToInvalidDZ(objectName, vizName) {
        let srcEl = await this.getGridElement(objectName, vizName),
        invalidDZ = await this.getVisualizationTitleBarTextArea(vizName);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcEl,
            toElem: invalidDZ
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * remove an object - drag the object out of grid visualization to dataset panel zone
     * @param objectName
     * @param vizName
     * @return {Promise<void>}
     */
    async removeObjectFromGrid(objectName, vizName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcEl = await this.getGridElement(objectName, vizName),
            invalidDZ = await this.datasetPanel.datasetPanel;

        //await this.baseDragFunction(srcEl, invalidDZ);
        await this.dragAndDrop({
            fromElem: srcEl,
            toElem: invalidDZ,
            toOffset: { x: 0, y: 0 },
        });
    }

    /**
     * Drag object from grid to another visualization
     * @param {*} objectName
     * @param {*} srcViz
     * @param {*} destViz
     */
    async dragObjectToOtherViz(objectName, srcViz, destViz) {
        let srcEl = await this.getGridElement(objectName, srcViz),
            destEl = await this.getGridContainer(destViz);
        await this.dragAndDropForAuthoringWithOffset({
            fromElem: srcEl,
            toElem: destEl,
            toOffset: { x: 0, y: 0 },
        });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async deleteColumnSet(columnSetName) {
        await this.hover({ elem: await this.getColumnSetInEditorPanel(columnSetName) });
        await this.click({ elem: await this.getColumnSetDeleteButton(columnSetName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async reorderColumnSet(columnSetName, desPosition, relColumnSetName, offsetX = 0, offsetY = 10) {
        const curSet = await this.getColumnSetDragArea(columnSetName);
        const relSet = await this.getColumnSetDragArea(relColumnSetName);
        await this.moveToSpecificLocationAndWait(desPosition, curSet, relSet, offsetX, offsetY);
    }

    async renameColumnSet(columnSetPosition, newColumnSetName) {
        const elColumnSetTitle = await this.getColumnSetTitleAtPos(columnSetPosition);
        await this.doubleClickOnElement(elColumnSetTitle);
        await this.clear({ elem: elColumnSetTitle });
        await elColumnSetTitle.addValue(newColumnSetName + '\uE007');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async expandCollapseColumnSet(columnSetName) {
        await this.click({ elem: this.getColumnSetExpandCollapse(columnSetName) });
    }

    async editMicrochart(setName, microchartName) {
        await this.hover({ elem: await this.getColumnSetInEditorPanel(setName) });
        await this.click({ elem: await this.getMicrochartEditButton(setName, microchartName) });
    }

    async switchToEditorPanel() {
        await this.click({ elem: this.editorPanelTab });
    }

    async clickOnViz(vizName) {
        await this.click({ elem: this.getVisualizationTitleBarTextArea(vizName) });
    }

    // creating a viz as filter in current dossier
    async createLocalContextualLink(srcVizName, tgtVizName) {
        await this.resetContextMenuButton(srcVizName);
        let visualizationContextMenuButton = await this.getContainerContextMenuButton(srcVizName);
        await this.click({ elem: visualizationContextMenuButton });

        let contextOption = await this.getContextMenuOption(visualizationContextMenuItem.CREATE_CONTEXTUAL_LINK);
        await this.click({ elem: contextOption });

        await this.click({ elem: this.currentDossierContextLinkBtn });
        await promiseWithTimeout(browser.pause(1000), undefined, 1000, `execution paused for 1 seconds`);
        await this.click({ elem: this.getContainer(tgtVizName) });
        const applyButton = InCanvasSelector.applyButtonFromFilterBoxDialog;
        await this.waitForElementVisible(applyButton);
        await this.click({ elem: applyButton });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await promiseWithTimeout(browser.pause(1000), undefined, 1000, `execution paused for 1 seconds`);
    }

    async selectElementOnViz(objectName, vizName) {
        await this.click({ elem: this.getGridObject(objectName, vizName) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async moveScrollBar(direction, pixels, vizName) {
        let orientation = direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical',
            scrollbar = await this.getGridScrollBar(orientation, vizName),
            numOfPixels = direction === 'left' || direction === 'top' ? -pixels : pixels;

        await this.dragAndDropByPixel(
            scrollbar,
            orientation === 'horizontal' ? numOfPixels : 0,
            orientation === 'vertical' ? numOfPixels : 0,
            true
        );
    }

    async scrollToGridCell(visualizationName, elementName) {
        let el = this.getGridElement(elementName, visualizationName);
        await this.scrollIntoView(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async resizeColumnByMovingBorder(colNum, pixels, direction, vizName) {
        let columnBorder = await this.getColumnBorder(colNum, vizName),
            numOfPixels = direction.toLowerCase() === 'left' ? -pixels : pixels;
        await this.dragAndDropByPixel(columnBorder, numOfPixels, 0, true);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async dismissContextMenu() {
        let el = await this.documentBody;
        await browser.execute(
            "var clickEvent = document.createEvent('MouseEvents');clickEvent.initEvent('mousedown', true, true);arguments[0].dispatchEvent (clickEvent);",
            el
        );
    }

    async clickOnContainerTitle(visualizationTitle) {
        await this.click({ elem: this.getContainerTitlebar(visualizationTitle) });
    }

    async clickOnColumnSet(columnSetName) {
        let columnSet = await this.getColumnSetInEditorPanel(columnSetName);
        await this.waitForElementClickable(columnSet);
        await browser.pause(1 * 1000);
        await this.click({ elem: columnSet });
    }

    async clickButtonInWarningDialog(buttonName) {
        let button = this.getButtonInWarningDialog(buttonName);
        await this.waitForElementVisible(button);
        await this.clickOnElement(button);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async scrollToElementInDatasetPanel(objectName, objectTypeName, datasetName) {
        await this.datasetPanel.switchDatasetsTab();
        let srcel = await this.datasetPanel.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await browser.execute((el) => {
            el.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, srcel);
        await browser.pause(1000);
    }

    async clickContextMenuOption(option) {
        await this.click({ elem: this.getContextMenuOption(option) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async waitForInfoWindowSpinnerGone(timeout = 10000) {
        const cursorSpinnerSelector = '.mstrd-CursorSpinner--visible';

        await browser.waitUntil(async () => (await $$(cursorSpinnerSelector)).length === 0, {
            timeout: timeout,
            timeoutMsg: 'Cursor spinner still visible',
        });
    }
}
