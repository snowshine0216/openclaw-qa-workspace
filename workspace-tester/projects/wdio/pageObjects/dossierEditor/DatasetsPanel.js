import { waitForResponse } from '../../api/browserDevTools/network.js';
import urlParser from '../../api/urlParser.js';
import { infoLog } from '../../config/consoleFormat.js';
import Utils from '../authoring/Utils.js';
import BaseAuthoring from '../base/BaseAuthoring.js';
import Alert from '../common/Alert.js';
import LoadingDialog from './components/LoadingDialog.js';

export default class DatasetsPanel extends BaseAuthoring {
    constructor() {
        super();
        this.alert = new Alert();
        this.loadingDialog = new LoadingDialog();
    }

    // Element Locator
    getDatasetsPanel() {
        return this.$('.mstrmojo-VIDatasetObjects');
    }

    getDatasetsPanelTitle() {
        return this.getDatasetsPanel().$('.mstrmojo-VIPanel-titlebar.top');
    }

    getDatasetsPanelContextMenuIcon() {
        return this.getDatasetsPanelTitle().$('.icn');
    }

    getNewDataBtnOnPanel() {
        return this.$('.btn--new-data .mstrmojo-Button-text');
    }

    getDIContainer() {
        return this.$('#DIContainer');
    }

    getDataSourceByName(name) {
        return this.getDIContainer()
            .$$('.mstrmojo-DataRow')
            .filter(async (elem) => {
                const textOnRow = await elem.getText();
                return textOnRow.includes(name);
            })[0];
    }

    getDataSourceCheckboxByName(name) {
        return this.getDataSourceByName(name).$('input[type="image"]');
    }

    getDataSourceByIndex(index) {
        // Index starts from 0 and corresponds to the order of data sources in the list vertically
        return this.getDIContainer().$$('.mstrmojo-di-layout .datasource-row')[index];
    }

    getSampleFilebyIndex(index) {
        return this.getDIContainer().$$('.mstrmojo-DataGrid-itemsContainer table tbody')[index];
    }

    getDBRoleSkeleton() {
        return this.$('.dbRoles-skeleton');
    }

    getDIWaitingIcon() {
        return this.$('.mstrmojo-Editor.mstrWaitBox');
    }

    getDIButtonByName(name) {
        return this.getDIContainer().$(
            `//div[contains(@class, 'mstrmojo-di-button')]/div[contains(@class, 'mstrmojo-Button-text') and text()='${name}']`
        );
    }

    getAttributeMetric(name) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIDocDatasetObjects')]//span[normalize-space(translate(text(), '\u00A0', ' '))='${name}']`
        );
    }

    getAttributeMetricByName(name) {
        return this.$(`//div[contains(@class, 'mstrmojo-VIDocDatasetObjects')]//span[contains(text(), '${name}')]`);
    }

    getDatasetElementByName(name) {
        return this.$('.mstrmojo-VIDocDatasetObjects')
            .$$('.item.unit')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText).includes(this.escapeRegExp(name));
            })[0];
    }

    getDatasetCount() {
        return this.$$('.docdataset-unitlist-portlet').length;
    }

    getDropzoneLabel(dropzoneName) {
        return this.$(`//div[contains(@class, 'mstrmojo-EditableLabel') and text() = '${dropzoneName}']`);
    }

    getWaitingWindow() {
        return this.$(`//div[contains(@class, 'mstrWaitMsg')]`);
    }

    getDatasetCurtain() {
        return this.$(`//div[contains(@class, 'mstrmojo-DIEditor-curtain')]`);
    }

    // if datasetElementName has space it replace with &nbsp;
    getDatasetElement(datasetElementName) {
        let preparedName = datasetElementName.replace(/\s/g, '\u00A0');
        return this.$(
            `//div[contains(@class, 'mstrmojo-VIDatasetObjects mstrmojo-VIDocDatasetObjects')]//div[contains(@class, 'item unit')]/span[text()='${preparedName}']`
        );
    }

    getPrepareDataElement(elementName) {
        return this.$(`//span[contains(@class, 'di-item-n')][text()='${elementName}']`);
    }

    getPrepareDataElementContextMenuButtons(buttonName) {
        return this.$(`//div[@class='mtxt'][text()='${buttonName}']`);
    }

    getDatasetByName(name) {
        return this.getDatasetsPanel()
            .$$('.docdataset-unitlist-portlet')
            .filter(async (elem) => {
                const elemText = await elem.$('.title-text').getText();
                return this.escapeRegExp(elemText) === this.escapeRegExp(name);
            })[0];
    }

    getDatasetByNameNew(name) {
        // Find both parent datasets (.docdataset-unitlist-portlet) and sub-datasets (.mstrmojo-VIPanel.mstrmojo-VIPanelPortlet)
        return this.getDatasetsPanel()
            .$$('.mstrmojo-VIPanel.mstrmojo-VIPanelPortlet')
            .filter(async (elem) => {
                const titleElem = await elem.$('.title-text');
                if (await titleElem.isExisting()) {
                    const elemText = await titleElem.getText();
                    return this.escapeRegExp(elemText) === this.escapeRegExp(name);
                }
                return false;
            })[0];
    }

    getDatasetMenuIcon(name) {
        return this.getDatasetByName(name).$('.item.mnu');
    }

    getOptionFromMenu(option) {
        return this.$(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//a[child::div[text()='${option}']]`);
    }

    getEditableField() {
        return this.$('.editable');
    }

    getElementCountByType(type) {
        switch (type) {
            case 'Attribute':
                return this.$$('.item.unit.ic12').length;
            case 'Metric':
                return this.$$('.item.unit.ic4').length;
            case 'DA':
                return this.$$('.item.unit.ic12d').length;
            case 'DM':
                return this.$$('.item.unit.ic4d').length;
            case 'NDE':
                return this.$$('.item.unit.ic47').length;
            default:
                throw 'Invalid type, pls use Attribute, Metric, DA, DM or NDE';
        }
    }

    getCreateObjectsBtn(datasetName) {
        return this.getDatasetByName(datasetName).$('.createobjects');
    }

    get uploadURLTextbox() {
        return this.$(`//*[@class='mstrmojo-di-URLUpload-urlInput']//input[contains(@class, 'mstrmojo-TextBox') and contains(@class, 'upload-url')]`);
    }

    get uploadURLAddButton() {
        return this.$(`//*[contains(@class, 'mstrmojo-di-add-url-button')]`);
    }

    getUploadURLListElement(url) {
        return this.$(`//*[contains(@class, 'mstrmojo-url-list')]//*[@class='mstrmojo-InlineEditBox urlItem-text-div']/*[contains(text(),'${url}')]`);
    }

    // Action Methods
    async clickDatasetsPanelMenuIcon() {
        await this.click({ elem: this.getDatasetsPanelContextMenuIcon() });
        await this.waitForElementVisible(this.getMenuContainer());
    }

    async clickNewDataBtn() {
        await this.click({ elem: this.getNewDataBtnOnPanel() });
        await this.waitForElementVisible(this.getDIContainer().$('.mstrmojo-di-layout .datasource-row'));
    }

    async clickNewDataBtnUntilShowDataSource() {
        await this.click({ elem: this.getNewDataBtnOnPanel() });
        await browser.waitUntil(
            async () => {
                const rows = await this.getDIContainer().$$('.mstrmojo-di-layout .datasource-row');
                return rows.length > 0;
            },
            {
                timeout: 50000,
                timeoutMsg: 'Expected .datasource-row to appear within 50s',
            }
        );
    }

    async clickDataSourceByIndex(index) {
        await this.waitForElementInvisible(this.getDBRoleSkeleton());
        await this.click({ elem: this.getDataSourceByIndex(index) });
        return await this.sleep(1000);
    }

    async prepareData(prepare) {
        await this.click({ elem: this.getDIButtonByName('Prepare Data') });
        for (const p of prepare) {
            await this.rightClick({ elem: this.getPrepareDataElement(p.name) });
            await this.click({ elem: this.getPrepareDataElementContextMenuButtons('Change Data Type') });
            await this.click({ elem: this.getPrepareDataElementContextMenuButtons(p.type) });
        }
        await this.click({ elem: this.getDIButtonByName('Finish') });
    }

    async importSampleFiles(indexes, prepare = []) {
        // Indexes are the order of files in the list, starts from 0
        for (let index of indexes) {
            await this.click({ elem: this.getSampleFilebyIndex(index) });
            await this.sleep(500);
        }
        await this.click({ elem: this.getDIButtonByName('Import') });
        await this.sleep(1000);
        await this.waitForElementInvisible(this.$('.mstrmojo-Box.mstrIcon-wait'));
        await browser.pause(500);
        if (await this.getDIButtonByName('Select').isDisplayed()) {
            await this.click({ elem: this.getDIButtonByName('Select') });
        }
        if (prepare.length > 0) {
            await this.prepareData(prepare);
        } else {
            await this.click({ elem: this.getDIButtonByName('Save') });
        }
        // Wait for the data source to be invisible
        await this.waitForElementInvisible(this.getDIContainer().$('.mstrmojo-di-layout .datasource-row'));
    }

    async addUploadURL(url) {
        let elText = await this.uploadURLTextbox;
        await this.waitForElementVisible(elText);
        await elText.setValue(url);
        let elAddButton = await this.uploadURLAddButton;
        await this.clickOnElement(elAddButton);
        let urlListElement = await this.getUploadURLListElement(url);
        await this.waitForElementVisible(urlListElement);
        await this.clickImportButton();
    }

    async importDataFromURL(url) {
        await this.clickDataSourceByIndex(1);
        await this.waitForElementVisible(this.uploadURLTextbox);
        await this.addUploadURL(url);
        await this.clickSaveButton();
        // Wait for the data source to be invisible
        await this.waitForElementInvisible(this.getDIContainer().$('.mstrmojo-di-layout .datasource-row'));
    }

    async selectDataSourceCheckboxByName(name) {
        await this.click({ elem: this.getDataSourceCheckboxByName(name) });
    }

    async clickImportButton() {
        await this.click({ elem: this.getDIButtonByName('Import') });
        await this.sleep(1000);
        await this.waitForElementInvisible(this.$('.mstrmojo-Box.mstrIcon-wait'));
    }

    async clickCancelButton() {
        try {
            await this.waitForElementVisible(this.getDIWaitingIcon());
        } catch (e) {
            // Do nothing
            console.log('No waiting icon found', e);
        }
        await this.waitForElementInvisible(this.getDIWaitingIcon());
        await this.waitForElementVisible(this.getDIContainer());
        return this.click({ elem: this.getDIButtonByName('Cancel') });
    }

    async clickCreateButton() {
        return this.click({ elem: this.getDIButtonByName('Create') });
    }

    async clickSaveButton() {
        return this.click({ elem: this.getDIButtonByName('Save') });
    }

    async doubleClickAttributeMetric(name) {
        await this.doubleClick({ elem: this.getAttributeMetric(name) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async doubleClickAttributeMetricByName(name) {
        await this.doubleClick({ elem: this.getAttributeMetricByName(name) });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async rightClickAttributeMetric(name) {
        await this.rightClick({ elem: this.getAttributeMetric(name) });
        await this.waitForCurtainDisappear();
        return this.sleep(1000);
    }

    async rightClickAttributeMetricByName(name) {
        await this.rightClick({ elem: this.getDatasetElementByName(name) });
        await this.waitForCurtainDisappear();
        return this.sleep(1000);
    }

    async ctrlClickAttributeMetric(name) {
        await this.ctrlClick({ elem: this.getAttributeMetric(name) });
    }

    async multiSelectAttributeMetric(names) {
        for (let name of names) {
            await this.ctrlClick({ elem: this.getAttributeMetric(name) });
        }
        await this.rightClick({ elem: this.getAttributeMetric(names[0]) });
    }

    async addDatasetElementToVisualization(datasetElementName) {
        await this.waitForElementVisible(this.getDatasetElement(datasetElementName));
        await this.waitForElementClickable(this.getDatasetElement(datasetElementName));
        await this.doubleClick({ elem: this.getDatasetElement(datasetElementName) });
        await this.waitForElementInvisible(this.getDIContainer(), {
            timeout: 5000,
            msg: 'DI container still here.',
        });
        await this.waitForElementStaleness(this.getDIWaitingIcon());
    }

    async actionOnMenu(option) {
        await this.click({ elem: this.getOptionFromMenu(option) });
    }

    async actionOnMenuSubmenu(menuItem, submenuItem) {
        await this.actionOnMenu(menuItem);
        await this.actionOnMenu(submenuItem);
        await this.waitForCurtainDisappear();
        return this.sleep(1000);
    }

    async renameObject(objectName, replaceName) {
        await this.rightClickAttributeMetric(objectName);
        await this.actionOnMenu('Rename');
        await this.input(replaceName);
        await this.enter();
        await this.sleep(500);
    }

    async preview(objectName) {
        await this.rightClickAttributeMetricByName(objectName);
        await this.actionOnMenu('Data preview');
        await this.sleep(100);
    }

    async createDMByCalculation(elementList, calculateMethod) {
        await this.multiSelectAttributeMetric(elementList);
        await this.actionOnMenuSubmenu('Calculation', calculateMethod);
    }

    async clickDatasetMenuIcon(name) {
        await this.click({ elem: this.getDatasetMenuIcon(name) });
    }

    async clickCreateObjectsBtn(datasetName) {
        await this.click({ elem: this.getCreateObjectsBtn(datasetName) });
        await this.waitForElementPresence(this.getMenuContainer());
    }

    // Assertion Helper
    async isAttributeMetricDisplayed(name) {
        return this.getAttributeMetricByName(name).isDisplayed();
    }

    async getSwitchToFormulaEditorButton() {
        return this.$('.mstrmojo-MetricIDE-browsers-container [aria-label="Switch to Formula Editor"]');
    }

    async clickSwitchToFormulaEditorButton() {
        infoLog('Clicking Switch to Formula Editor button');
        const getSwitchToFormulaEditorButton = await this.getSwitchToFormulaEditorButton();
        await getSwitchToFormulaEditorButton.waitForEnabled();
        await this.sleep(2000);
        await browser.execute(`document.querySelector('[aria-label="Switch to Formula Editor"]').click()`);
    }

    async getClearFormulaEditorButton() {
        return this.$('.mstrmojo-Button.mstrmojo-WebHoverButton.clear');
    }
    async clickClearFormulaEditorButton() {
        const clearFormulaEditorButton = await this.getClearFormulaEditorButton();
        await clearFormulaEditorButton.waitForDisplayed({ interval: 500 });
        await clearFormulaEditorButton.click().catch((e) => {
            console.log('Error in clicking Clear Formula Editor button', e);
        });
    }

    async mockTaskProcRequest() {
        const baseUrl = urlParser(browser.options.baseUrl);
        return await browser.mock(`${baseUrl}servlet/taskProc`);
    }

    async getSaveFormulaEditorButton() {
        return this.$('.mstrmojo-MetricEditor .mstrmojo-Editor-buttons .me-save-button');
    }
    async clickSaveFormulaEditorButton() {
        const mockTaskProcRequest = await this.mockTaskProcRequest();
        const saveFormulaEditorButton = await this.getSaveFormulaEditorButton();
        await saveFormulaEditorButton.waitForDisplayed({ interval: 500 });
        await saveFormulaEditorButton.click().catch((e) => {
            console.log('Error in clicking Save Formula Editor button', e);
        });
        // wait for 2 requests: 1.validateMetric 2.mojoRWManipulation
        await waitForResponse(mockTaskProcRequest, 1);
        await mockTaskProcRequest.restore();
        // sleep for response to be processed
        await this.sleep(200);
    }

    getAddDataOptionButton(addDataOption) {
        return this.$(
            `//div[contains(@class, 'mstrmojo-RootView-datasets')]//div[@class='mstrmojo-Button-text ' and text()='${addDataOption}']`
        );
    }

    async addDataFromDatasetsPanel(addDataOption) {
        await this.clickOnElement(this.getAddDataOptionButton(addDataOption));
    }

    getObjectFromDataset(objectName, objectTypeName, datasetName) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet')]/div[@class='mstrmojo-VIPanel-content']//div[contains(@class,'ic${objectType}') and child::*[text()='${objectName.replace(
                / /g,
                '\u00a0'
            )}'] and ancestor::div[child::div[@class='mstrmojo-VIPanel-titlebar' and  child::div/child::div[@class='title-text']/child::div[text()='${datasetName}']]]]`
        );
    }

    getUnusedObjectFromDataset(objectName, objectTypeName, datasetName) {
        let objectType = Utils.objectTypeIdExtended(objectTypeName.toLowerCase(), '');
        return this.$(
            `//*[contains(@class,'mstrmojo-VIPanel docdataset-unitlist-portlet')]/div[@class='mstrmojo-VIPanel-content']/div/div/div[contains(@class,'ic${objectType}') and contains(@class,'unused') and child::*[text()='${objectName.replace(
                / /g,
                '\u00a0'
            )}'] and parent::div/parent::div/parent::div/parent::div[child::div[@class='mstrmojo-VIPanel-titlebar' and  child::div/child::div[@class='title-text']/child::div[text()='${datasetName}']]]]`
        );
    }

    async addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName) {
        const el = await this.getObjectFromDataset(objectName, objectTypeName, datasetName);
        await this.waitForElementClickable(el);
        await el.click();
        await this.doubleClickOnElement(el);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addAttributeToVizByDoubleClick(attributeName, datasetName) {
        await this.addObjectToVizByDoubleClick(attributeName, 'attribute', datasetName);
    }

    async addMetricToVizByDoubleClick(metricName, datasetName) {
        await this.addObjectToVizByDoubleClick(metricName, 'metric', datasetName);
    }

    async clickSwitchTabButton() {
        const el = this.$('.mstrmojo-switchTabBtn');
        await el.click();
    }

    get splitter() {
        return this.getDatasetsPanel().$('.mstrmojo-VIPanel-handle.splitter');
    }

    async changePanelWidthByPixel(offsetX) {
        const splitterEl = await this.splitter;
        await this.dragAndDropByPixel(splitterEl, offsetX, 0, true);
    }

    async selectContextMenuOption(option) {
        await this.clickDatasetsPanelMenuIcon();
        await this.actionOnMenu(option);
    }

    async selectContextMenuOptionWithHover(option) {
        await this.clickDatasetsPanelMenuIcon();
        const menuItem = this.getOptionFromMenu(option);
        await this.waitForElementVisible(menuItem);
        // Hover over the menu item to trigger submenu
        await menuItem.moveTo();
        await this.sleep(500); // Wait for submenu to appear
    }

    async selectSecondaryContextMenuOption(option) {
        await this.actionOnMenu(option);
    }

    async isDatasetPresentByName(name) {
        try {
            const dataset = await this.getDatasetByNameNew(name);
            return await dataset.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async isDatasetExpanded(datasetName) {
        try {
            const dataset = await this.getDatasetByNameNew(datasetName);
            const contentPanel = await dataset.$('.mstrmojo-VIPanel-content');
            return await contentPanel.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async collapseDataset(datasetName) {
        const isExpanded = await this.isDatasetExpanded(datasetName);
        if (isExpanded) {
            const dataset = await this.getDatasetByNameNew(datasetName);
            const titlebar = await dataset.$('.mstrmojo-VIPanel-titlebar');
            const toggle = await titlebar.$('.left-toolbar .mstrmojo-Image');
            await this.click({ elem: toggle });
        }
    }

    async expandDataset(datasetName) {
        const isExpanded = await this.isDatasetExpanded(datasetName);
        if (!isExpanded) {
            const dataset = await this.getDatasetByNameNew(datasetName);
            const titlebar = await dataset.$('.mstrmojo-VIPanel-titlebar');
            const toggle = await titlebar.$('.left-toolbar .mstrmojo-Image');
            await this.click({ elem: toggle });
        }
    }

    async rightClickAttributeMetricAndSelectOption(name, type, option) {
        if (type === 'metric') {
            await this.rightClickAttributeMetric(name);
        } else {
            await this.rightClickAttributeMetricByName(name);
        }
        // Wait for menu to appear and be clickable
        const menuOption = this.getOptionFromMenu(option);
        await this.waitForElementVisible(menuOption, { timeout: 10000 });
        await this.waitForElementClickable(menuOption, { timeout: 10000 });
        await this.sleep(500); // Additional stability wait
        await this.actionOnMenu(option);
    }
}
