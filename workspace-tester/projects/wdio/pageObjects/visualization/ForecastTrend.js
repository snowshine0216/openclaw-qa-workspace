import VisualizationPanel from '../dossierEditor/VisualizationPanel.js';
import DossierPage from '../dossier/DossierPage.js';
import EditorPanel from '../dossierEditor/EditorPanel.js';
import BaseVisualization from '../base/BaseVisualization.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import { takeScreenshotByElement } from '../../utils/TakeScreenshot.js';
import FormatPanel from '../dossierEditor/FormatPanel.js';
import { Key } from 'webdriverio';

export default class ForecastTrend extends BaseVisualization {
    constructor() {
        super();
        this.vizPanel = new VisualizationPanel();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.dossierPage = new DossierPage();
        this.editorPanel = new EditorPanel();
        this.formatPanel = new FormatPanel();
        this.baseVisualization = new BaseVisualization();
    }

    Tolerance = 3;
    // locators
    getForecastlineopacity() {
        return this.$('.abaloc-inputnumber-forecastlineopacity');
    }

    getConfidencebandopacity() {
        return this.$('.abaloc-inputnumber-confidencebandopacity');
    }

    getForecastlineopacityInput() {
        return this.getForecastlineopacity().$('input');
    }

    getConfidencebandopacityInput() {
        return this.getConfidencebandopacity().$('input');
    }

    //Editor panel
    TargetNameDropZone = `//div[contains(@class, 'mstrmojo-VIVizEditor')]//div[contains(@class, 'mstrmojo-VIPanelPortlet')][1]//div[contains(@class, 'mstrmojo-VIPanel-content')]`;
    TimeAttributeDropZone = `//div[contains(@class, 'mstrmojo-VIVizEditor')]//div[contains(@class, 'mstrmojo-VIPanelPortlet')][2]//div[contains(@class, 'mstrmojo-VIPanel-content')]`;
    BreakByDropZone = `//div[contains(@class, 'mstrmojo-VIVizEditor')]//div[contains(@class, 'mstrmojo-VIPanelPortlet')][3]//div[contains(@class, 'mstrmojo-VIPanel-content')]`;

    ContextMenu = `/html/body/div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-VIVizEditor-Menu')]`;
    ContextMenuItems = `/html/body/div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mtxt')]`;
    ContextMenus = `/html/body/div[contains(@class, 'mstrmojo-popup-widget-hosted')]/div[contains(@class, 'mstrmojo-ui-Menu')]`;
    ContextMenuEditor = `/html/body/div[contains(@class, 'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-ui-MenuEditor')]`;

    // Format panel
    FormatPanelContent = `//*[@id="reactFormatPanel"]//div[contains(@class, 'content')]`;
    ContainerFit = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-containerfitlayout')]//span[contains(@class, 'hideable-layout-title')]`;
    ContainerFitDropDown = `//*[@id="reactFormatPanel"]//span[contains(@class, 'container-fit')]`;

    DataLabelSwitch = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-datalabelsenabled')]//div[@id="mstr-switch-toggle"]`;
    DataLabelHideOverlappingLabels = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-datalabelsenabled')]//input`;

    Axes = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-axeslayout')]//span[contains(@class, 'hideable-layout-title')]`;
    GridLines = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-switch-allgridlineshow')]`;
    AxisDirection = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-axistypetoshow')]//div[contains(@class, 'dropdown-menu-control-box')]`;
    Horizontal = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-axistypetoshow')]//div[contains(@class, 'dropdown-menu-option-list')]/div[1]`;
    Vertical = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-axistypetoshow')]//div[contains(@class, 'dropdown-menu-option-list')]/div[2]`;
    AxisTitle = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-switch-xaxistitleshow') or contains(@class, 'abaloc-switch-yaxistitleshow')]`;
    AxisLabel = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-switch-xaxislabelshow') or contains(@class, 'abaloc-switch-yaxislabelshow')]`;
    RotationDropDown = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-select-xaxislabelrotation')]`;

    LegendSwitch = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-legendenabled')]//div[contains(@class, 'mstr-switch-container')]`;
    ShowTitle = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-checkbox-legendtitlehide')]//label`;

    TrendLineSwitch = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-trendlineenabled')]//div[contains(@class, 'mstr-switch-container')]`;

    ForecastSwitch = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-forecastenabled')]//div[contains(@class, 'mstr-switch-container')]`;
    ForecastLengthUp = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-inputnumber-forecastlength')]//span[contains(@class, 'ant-input-number-handler-up')]`;
    ForecastLengthDown = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-inputnumber-forecastlength')]//span[contains(@class, 'ant-input-number-handler-down')]`;
    DataLabelsSwitch = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-hideablelayout-forecastenabled')]//div[contains(@class, 'abaloc-horizontallayout-forecastdatalabelssection')]//div[contains(@class, 'mstr-switch-container')]`;
    DataLabelsHideOL = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-checkbox-forecastdatalabelshideoverlappingenabled')]//input`;

    ReferenceLineAdd = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-editablelist-referencelines')]//div[contains(@class, 'add')]`;
    ReferenceLineEnable = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-editablelist-referencelines')]//div[contains(@class, 'mstr-editor-checkbox')]`;
    ReferenceLineDelete = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-editablelist-referencelines')]//div[@class = 'delete']`;
    ReferenceLineDropDown = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-editablelist-referencelines')]//div[contains(@class, 'ant-select-selector')]`;
    LineLabelSwitch = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-horizontallayout-horizontallayout_2')]//div[contains(@class, 'mstr-switch-container')]`;
    BarLogicType = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-multiselectbarlogic-')]//li[1]//div[contains(@class, 'mstr-editor-toggle')]`;
    BarLogicMetric = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-multiselectbarlogic-')]//li[2]//div[contains(@class, 'mstr-editor-toggle')]`;
    BarLogicValue = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-multiselectbarlogic-')]//li[3]//div[contains(@class, 'mstr-editor-toggle')]`;
    ReferenceLineConstantValue = `//*[@id="reactFormatPanel"]//div[contains(@class, 'insightlinechart-referenceLineConstantValue')]//input`;

    //Text and Form
    TextAndFormDropDown = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]`;
    EntireGraph = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]//div[contains(@id, 'drop-down-menu-option')][1]`;

    ColorPickDropDown = `//*[@id="reactFormatPanel"]//span[contains(@class, 'mstr-editor-color-picker')]//div[contains(@class, 'color-picker-arrow-button')]`;
    ButtonPickColor = `//div[contains(@class, 'abaloc-colorpicker-fontcolorglobal')]//button[contains(@title, 'Iceberg #DCECF1')]`;

    DataLabelAndShapes = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]//div[contains(@id, 'drop-down-menu-option')][2]`;

    ShowDataLabels = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-switch-datalabelsshow')]//div[contains(@id, 'mstr-switch-toggle')]`;
    ShowMaker = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-switch-markershow')]//div[contains(@id, 'mstr-switch-toggle')]`;
    LineTypeDropDown = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-select-mainlinetype')]`;
    LineTypeDash = `//div[contains(@class, 'mstr-editor-select')]//span[contains(@class, 'dash')]`;

    LineColorPickDropDown = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-colorpicker-mainlinecolor')]//div[contains(@class, 'color-picker-arrow-button')]`;
    ButtonPickColor2 = `//div[contains(@class, 'abaloc-colorpicker-mainlinecolor')]//button[contains(@title, 'Honey #E69912')]`;

    AxesAndGridLines = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]//div[contains(@id, 'drop-down-menu-option')][3]`;
    Forecast = `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]//div[contains(@id, 'drop-down-menu-option')][1]`;

    //Viz menu
    ShowData = `/html/body//div[contains(@class, 'mstrmojo-ViewDataDialog')]`;
    ShowDataClose = `/html/body//div[contains(@class, 'mstrmojo-ViewDataDialog')]//div[contains(@class, 'mstrmojo-Editor-content')]//div[contains(@class, 'mstrmojo-Button-text')]`;
    AlertYes = `/html/body//div[contains(@id, 'mojoAlertx')]//div[contains(@class, 'mstrmojo-Button-text')]`;

    async checkElementByImageComparison(element, testCase, imageName) {
        await takeScreenshotByElement(element, testCase, imageName, {tolerance: this.Tolerance});
    }

    async clickTargetNameDropZone() {
        let targetNameDropZone = await this.editorPanel.getElementByXPath(this.TargetNameDropZone);
        await this.dossierPage.rightClick({ elem: targetNameDropZone });
        await this.dossierPage.sleep(1000);
    }

    async clickTimeAttributeDropZone() {
        let timeAttributeDropZone = await this.editorPanel.getElementByXPath(this.TimeAttributeDropZone);
        await this.dossierPage.rightClick({ elem: timeAttributeDropZone });
        await this.dossierPage.sleep(1000);
    }

    async clickBreakByDropZone() {
        let breakByDropZone = await this.editorPanel.getElementByXPath(this.BreakByDropZone);
        await this.dossierPage.rightClick({ elem: breakByDropZone });
        await this.dossierPage.sleep(1000);
    }

    async getContextMenu() {
        let contextMenu = await this.editorPanel.getElementByXPath(this.ContextMenu);
        await this.dossierPage.waitForElementVisible(contextMenu, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        return contextMenu;
    }

    async clickMenuItemByName(name) {
        let contextMenuItem = await this.editorPanel.getElementByXPathText(this.ContextMenuItems, name);
        await this.dossierPage.click({ elem: contextMenuItem });
        await this.dossierPage.sleep(1000);
    }

    async getSubMenu() {
        let subMenu = await this.editorPanel.getNthElementsByXPath(this.ContextMenus, 1);
        await this.dossierPage.waitForElementVisible(subMenu, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        return subMenu;
    }

    async clickSubMenuItemByName(name) {
        let subContextMenuItem = await this.editorPanel.getElementByXPathText(this.ContextMenuItems, name);
        await this.dossierPage.click({ elem: subContextMenuItem });
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async getContextMenuEditor() {
        let contextMenuEditor = await this.editorPanel.getElementByXPath(this.ContextMenuEditor);
        await this.dossierPage.waitForElementVisible(contextMenuEditor, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        return contextMenuEditor;
    }

    async clickUndo() {
        await this.dossierPage.clickUndoInDossier();
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickRedo() {
        await this.dossierPage.clickRedoInDossier();
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async dismissPopups() {
        await this.dossierPage.clickTopLeftCorner();
        await this.dossierPage.sleep(1000);
    }

    async dismissTooltip() {
        await this.dossierPage.moveToTopLeftCorner();
        await this.dossierPage.sleep(1000);
    }

    async clickContainerFitSection() {
        let containerFitLayout = await this.formatPanel.getElementByXPath(this.ContainerFit);
        await containerFitLayout.click();
    }

    async clickContainerFitDropDown() {
        let containerFitDropDown = await this.formatPanel.getElementByXPath(this.ContainerFitDropDown);
        await this.dossierPage.waitForElementVisible(containerFitDropDown, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await containerFitDropDown.click();
        await this.dossierPage.sleep(1000);
    }

    async clickContainerFitOption(option) {
        let containerFit_None = await this.formatPanel.getElementByXPath(
            `//span[contains(@class, 'mstr-editor-select') and contains(@class, 'container-fit') and contains(@class, '${option}')]`
        );
        await containerFit_None.click();
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickDataLabelSwitch() {
        let dataLabelSwitch = await this.formatPanel.getElementByXPath(this.DataLabelSwitch);
        await dataLabelSwitch.click();
    }

    async clickDataLabelHideOverlappingLabels() {
        let dataLabelHideOverlappingLabels = await this.formatPanel.getElementByXPath(
            this.DataLabelHideOverlappingLabels
        );
        //await dossierPage.waitForElementVisible(dataLabelHideOverlappingLabels, { timeout: dossierPage.DEFAULT_TIMEOUT * 100 });
        await dataLabelHideOverlappingLabels.click();
        await this.dossierPage.sleep(1000);
    }

    async clickAxesSection() {
        let axes = await this.formatPanel.getElementByXPath(this.Axes);
        await axes.click();
    }

    async clickGridLines() {
        let gridLines = await this.formatPanel.getElementByXPath(this.GridLines);
        await this.dossierPage.waitForElementVisible(gridLines, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await gridLines.click();
        await this.dossierPage.sleep(1000);
    }

    async clickGridLineOption(option) {
        let gridLinesAuto = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-radio-allgridlineshowtype')]//div[contains(@class, '${option}')]`
        );
        await gridLinesAuto.click();
        await this.dismissTooltip();
        await this.dossierPage.sleep(1000);
    }

    async clickAxisDirection() {
        let axisDirection = await this.formatPanel.getElementByXPath(this.AxisDirection);
        await axisDirection.click();
    }

    async clickHorizontalAxisOption() {
        let horizontal = await this.formatPanel.getElementByXPath(this.Horizontal);
        await this.dossierPage.waitForElementVisible(horizontal, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await horizontal.click();
        await this.dossierPage.sleep(1000);
    }

    async clickVerticalAxisOption() {
        let vertical = await this.formatPanel.getElementByXPath(this.Vertical);
        await this.dossierPage.waitForElementVisible(vertical, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await vertical.click();
        await this.dossierPage.sleep(1000);
    }

    async clickAxisTitle() {
        let axisTitle = await this.formatPanel.getElementByXPath(this.AxisTitle);
        await axisTitle.click();
        await this.dossierPage.sleep(1000);
    }

    async clickAxisLabel() {
        let axisLabel = await this.formatPanel.getElementByXPath(this.AxisLabel);
        await axisLabel.click();
        await this.dossierPage.sleep(1000);
    }

    async clickRotationDropDown() {
        let rotationDropDown = await this.formatPanel.getElementByXPath(this.RotationDropDown);
        await rotationDropDown.click();
        await this.dossierPage.sleep(1000);
    }

    async clickRotationOption(option) {
        let rotationHorizontal = await this.formatPanel.getElementByXPath(
            `/html/body//div[contains(@class, 'rc-virtual-list-holder-inner')]//span[contains(text(), '${option}')]`
        );
        await rotationHorizontal.click();
        await this.dossierPage.sleep(1000);
    }

    async clickRotationCustomOption(option) {
        let rotationCustom30 = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-radio-xaxislabelangle')]//span[contains(text(), '${option}')]`
        );
        await rotationCustom30.click();
        await this.dossierPage.sleep(1000);
    }

    async clickLegendSwitch() {
        let legendSwitch = await this.formatPanel.getElementByXPath(this.LegendSwitch);
        await legendSwitch.click();
        await this.dossierPage.sleep(1000);
    }

    async clickShowTitle() {
        let showTitle = await this.formatPanel.getElementByXPath(this.ShowTitle);
        await this.dossierPage.waitForElementVisible(showTitle, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await showTitle.click();
        await this.dossierPage.sleep(1000);
    }

    async clickTrendLineSwitch() {
        let trendLineSwitch = await this.formatPanel.getElementByXPath(this.TrendLineSwitch);
        await trendLineSwitch.click();
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickForecastSwitch() {
        let forecastSwitch = await this.formatPanel.getElementByXPath(this.ForecastSwitch);
        await forecastSwitch.click();
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickForecastLengthUp() {
        let forecastLengthUp = await this.formatPanel.getElementByXPath(this.ForecastLengthUp);
        await this.dossierPage.waitForElementVisible(forecastLengthUp, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await forecastLengthUp.click();
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickForecastLengthDown() {
        let forecastLengthDown = await this.formatPanel.getElementByXPath(this.ForecastLengthDown);
        await forecastLengthDown.click();
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickDataLabelsSwitch() {
        let dataLabelsSwitch = await this.formatPanel.getElementByXPath(this.DataLabelsSwitch);
        await dataLabelsSwitch.click();
        await this.dossierPage.sleep(1000);
    }

    async clickDataLabelsHideOL() {
        let dataLabelsHideOL = await this.formatPanel.getElementByXPath(this.DataLabelsHideOL);
        await dataLabelsHideOL.click();
        await this.dossierPage.sleep(1000);
    }

    async clickReferenceLineAdd() {
        let referenceLineAdd = await this.formatPanel.getElementByXPath(this.ReferenceLineAdd);
        await referenceLineAdd.click();
        //since newly created.
        await this.dossierPage.sleep(1000);
    }

    async clickReferenceLineEnable() {
        let referenceLineEnable = await this.formatPanel.getElementByXPath(this.ReferenceLineEnable);
        await referenceLineEnable.click();
        await this.dossierPage.sleep(1000);
    }

    async clickLineLabelSwitch() {
        let lineLabelSwitch = await this.formatPanel.getElementByXPath(this.LineLabelSwitch);
        await lineLabelSwitch.click();
        await this.dossierPage.sleep(1000);
    }

    async clickBarLogicMetric() {
        let barLogicMetric = await this.formatPanel.getElementByXPath(this.BarLogicMetric);
        await barLogicMetric.click();
        await this.dossierPage.sleep(1000);
    }

    async clickBarLogicValue() {
        let barLogicValue = await this.formatPanel.getElementByXPath(this.BarLogicValue);
        await barLogicValue.click();
        await this.dossierPage.sleep(1000);
    }

    async clickBarLogicType() {
        let barLogicType = await this.formatPanel.getElementByXPath(this.BarLogicType);
        await barLogicType.click();
        await this.dossierPage.sleep(1000);
    }

    async clickReferenceLineDelete() {
        let referenceLineDelete = await this.formatPanel.getElementByXPath(this.ReferenceLineDelete);
        await referenceLineDelete.click();
        await this.dossierPage.sleep(1000);
    }

    async setReferenceLineConstantValue(value) {
        let referenceLineConstantValue = await this.formatPanel.getElementByXPath(this.ReferenceLineConstantValue);
        await referenceLineConstantValue.click();
        await browser.keys(`${value}`);
        await browser.keys('Enter');
        await this.dossierPage.sleep(1000);
    }

    async clickTextAndFormDropDown() {
        let textAndFormDropDown = await this.formatPanel.getElementByXPath(this.TextAndFormDropDown);
        await textAndFormDropDown.click();
        await this.dossierPage.sleep(1000);
    }

    async clickEntireGraph() {
        let entireGraph = await this.formatPanel.getElementByXPath(this.EntireGraph);
        await this.dossierPage.waitForElementVisible(entireGraph, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await entireGraph.click();
        await this.dossierPage.sleep(1000);
    }

    async clickFontStyle(option) {
        let fontBold = await this.formatPanel.getElementByXPath(
            `(//*[@id="reactFormatPanel"]//div[contains(@class, 'mstr-editor-toggle')])[${option}]`
        );
        await fontBold.click();
        await this.dossierPage.sleep(1000);
    }

    async clickFontSizeInc() {
        let fontSizeInc = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//span[contains(@class, 'ant-input-number-handler-up')]`
        );
        await fontSizeInc.click();
        await this.dossierPage.sleep(1000);
    }

    async clickFontSizeDec() {
        let fontSizeDec = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//span[contains(@class, 'ant-input-number-handler-down')]`
        );
        await fontSizeDec.click();
        await this.dossierPage.sleep(1000);
    }

    async clickColorPickDropDown(abaloc) {
        let colorPickDropDown = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//div[contains(@class, 'color-picker-arrow-button')]`
        );
        await colorPickDropDown.click();
        await this.dossierPage.sleep(1000);
    }

    async chooseColorInColorPicker(abaloc) {
        let buttonPickColor = await this.formatPanel.getElementByXPath(
            `//div[contains(@class, '${abaloc}')]//button[contains(@title, 'Iceberg #DCECF1')]`
        );
        await this.dossierPage.waitForElementVisible(buttonPickColor, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await buttonPickColor.click();
        await this.dossierPage.sleep(1000);
    }

    async clickDataLabelAndShapes() {
        let dataLabelAndShapes = await this.formatPanel.getElementByXPath(this.DataLabelAndShapes);
        await this.dossierPage.waitForElementVisible(dataLabelAndShapes, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await dataLabelAndShapes.click();
        await this.dossierPage.sleep(1000);
    }

    async clickShowDataLabels() {
        let showDataLabels = await this.formatPanel.getElementByXPath(this.ShowDataLabels);
        await showDataLabels.click();
        await this.dossierPage.sleep(1000);
    }

    async clickShowMaker() {
        let showMaker = await this.formatPanel.getElementByXPath(this.ShowMaker);
        await showMaker.click();
        await this.dossierPage.sleep(1000);
    }

    async clickTypeDropDown(abaloc) {
        let lineTypeDropDown = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//div[contains(@class, 'ant-select-selector')]`
        );
        await lineTypeDropDown.click();
        await this.dossierPage.sleep(1000);
    }

    async chooseTypeInDropDown(option, notOption) {
        let xPath = `//div[contains(@class, 'mstr-editor-select')]//span[contains(@class, '${option}')`;
        xPath = xPath + (notOption ? ` and not(contains(@class, '${notOption}'))` : '') + ']';
        //let lineTypeDash = await this.formatPanel.getElementByXPath(xPath);
        //Since the drop down element are exactly the same, so get the newly created one.
        let lineTypeDash = await this.editorPanel.getLastElementByXPath(xPath);
        await this.dossierPage.waitForElementVisible(lineTypeDash, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await lineTypeDash.click();
        await this.dossierPage.sleep(1000);
    }

    async clickAxisAndGridLines() {
        let dataLabelAndShapes = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]//div[contains(@id, 'drop-down-menu-option')][3]`
        );
        await this.dossierPage.waitForElementVisible(dataLabelAndShapes, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await dataLabelAndShapes.click();
        await this.dossierPage.sleep(1000);
    }

    async clickInlineDropDown(abaloc) {
        let dataLabelAndShapes = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//div[contains(@class, 'dropdown-menu-control-box')]`
        );
        await this.dossierPage.waitForElementVisible(dataLabelAndShapes, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await dataLabelAndShapes.click();
        await this.dossierPage.sleep(1000);
    }

    async clickInlineDropDownItem(abaloc, option) {
        let dataLabelAndShapes = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//span[contains(text(), '${option}') and contains(@class, 'dropdown-menu-option-display-name')]`
        );
        await this.dossierPage.waitForElementVisible(dataLabelAndShapes, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await dataLabelAndShapes.click();
        await this.dossierPage.sleep(1000);
    }

    async clickSwitch(abaloc) {
        let switcher = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//div[@id="mstr-switch-toggle"]`
        );
        await this.dossierPage.waitForElementVisible(switcher, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await switcher.click();
        await this.dossierPage.sleep(1000);
    }

    async clickForecast() {
        let dataLabelAndShapes = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]//div[contains(@id, 'drop-down-menu-option')][4]`
        );
        await this.dossierPage.waitForElementVisible(dataLabelAndShapes, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await dataLabelAndShapes.click();
        await this.dossierPage.sleep(1000);
    }
    async clickTrendLine() {
        let dataLabelAndShapes = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, 'abaloc-segmentcontroldropdownmenu-textandformitem')]//div[contains(@id, 'drop-down-menu-option')][4]`
        );
        await this.dossierPage.waitForElementVisible(dataLabelAndShapes, {
            timeout: this.dossierPage.DEFAULT_TIMEOUT * 100,
        });
        await dataLabelAndShapes.click();
        await this.dossierPage.sleep(1000);
    }

    async inputNumberUp(abaloc) {
        let inputNumber = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//input`
        );
        await this.baseVisualization.hover({ elem: inputNumber });
        await this.dossierPage.sleep(1000);
        let up = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//span[contains(@class, 'ant-input-number-handler-up')]`
        );
        await this.dossierPage.waitForElementVisible(up, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await up.click();
        await this.dossierPage.sleep(1000);
    }

    async inputNumberDown(abaloc) {
        let inputNumber = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//input`
        );
        await this.click({ elem: inputNumber });
        await this.dossierPage.sleep(1000);
        let down = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//span[contains(@class, 'ant-input-number-handler-down')]`
        );
        await this.dossierPage.waitForElementVisible(down, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        await down.click();
        await this.dossierPage.sleep(1000);
    }

    async clickDropDown(abaloc) {
        let dropDown = await this.formatPanel.getElementByXPath(
            `//*[@id="reactFormatPanel"]//div[contains(@class, '${abaloc}')]//div[contains(@class, 'ant-select-selector')]`
        );
        await dropDown.click();
        await this.dossierPage.sleep(1000);
    }

    async clickDropDownItem(option) {
        let dropDownOption = await this.formatPanel.getElementByXPath(
            `//div[contains(@class, 'mstr-editor-select')]//div[contains(@class, 'rc-virtual-list-holder-inner')]//span[contains(text(), '${option}')]`
        );
        await dropDownOption.click();
        await this.dossierPage.sleep(1000);
    }

    async clickAndgetVizMenu(name) {
        let vizMenuButton = await this.baseVisualization.getVisualizationMenuButton(name);
        await this.baseVisualization.hover({ elem: vizMenuButton });
        await this.dossierPage.click({ elem: vizMenuButton });
        let vizMenu = await this.baseVisualization.getContextMenuByLevel(0);
        await this.dossierPage.waitForElementVisible(vizMenu, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        return vizMenu;
    }

    async clickVizMenuItemByName(name) {
        let menuShowData = await this.baseVisualization.getContextMenuOption({ level: 0, option: name });
        await this.dossierPage.click({ elem: menuShowData });
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickVizMenuSubItemByName(name) {
        let menuShowData = await this.baseVisualization.getContextMenuOption({ level: 1, option: name });
        await this.dossierPage.click({ elem: menuShowData });
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async getShowDataDialog() {
        let showData = await this.baseVisualization.$(this.ShowData);
        await this.dossierPage.waitForElementVisible(showData, { timeout: this.dossierPage.DEFAULT_TIMEOUT * 100 });
        return showData;
    }

    async closeShowDataDialog() {
        let showDataClose = await this.baseVisualization.$(this.ShowDataClose);
        await this.dossierPage.click({ elem: showDataClose });
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }

    async clickAlertYes() {
        let alertYes = await this.baseVisualization.$(this.AlertYes);
        await this.dossierPage.click({ elem: alertYes });
        await this.formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await this.dossierPage.sleep(1000);
    }
}
