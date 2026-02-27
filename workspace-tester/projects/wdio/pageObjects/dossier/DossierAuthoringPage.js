import BasePage from '../base/BasePage.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import DossierPage from './DossierPage.js';
import DatasetsPanel from '../dossierEditor/DatasetsPanel.js';
import { fixChromeDownloadDirectory } from '../../config/folderManagement.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import Alert from '../common/Alert.js';
import EditorPanel from '../dossierEditor/EditorPanel.js';
import InCanvasSelector from '../selector/InCanvasSelector.js';
import DashboardMenuBar from './DashboardMenuBar.js';
import BaseFormatPanel from '../authoring/BaseFormatPanel.js';
import SaveAsEditor from '../common/SaveAsEditor.js';
import AntdMessage from '../common/AntdMessage.js';
import ToggleBar from '../dossierEditor/ToggleBar.js';
import DatasetPanel from '../authoring/DatasetPanel.js';

export default class DossierAuthoringPage extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
        this.datasetsPanel = new DatasetsPanel();
        this.loadingDialog = new LoadingDialog();
        this.alert = new Alert();
        this.editorPanel = new EditorPanel();
        this.inCanvasSelector = new InCanvasSelector();
        this.dashboardMenuBar = new DashboardMenuBar();
        this.baseFormatPanel = new BaseFormatPanel();
        this.saveAsEditor = new SaveAsEditor();
        this.togglePanelBar = new ToggleBar();
        this.datasetPanel = new DatasetPanel();
        this.antdMessage = new AntdMessage();
    }

    // Element locator

    /** Get button in Menubar (including switch) */
    /** @type {Promise<ElementFinder>} */
    /** @param {string} buttonName name of the button in Menubar*/
    /*Buttons can be selected no matter they are clicked or not*/
    getButtonFromMenubar(buttonName) {
        switch (buttonName) {
            case 'LIBRARY':
                return this.$('.item.btn.library');
            case 'FILE':
                return this.$('.item.mb.file');
            case 'INSERT':
                return this.$('.item.mb.insert');
            case 'FORMAT':
                return this.$('.item.mb.style');
            case 'SHARE':
                return this.$('.item.mb.share');
            case 'VIEW':
                return this.$('.item.mb.view');
            case 'HELP':
                return this.$('.item.mb.help');
            // fsuo: Close is moved to menubar in library
            case 'CLOSE':
                return this.$('.item.btn.close');
            default:
                throw 'Invalid Menu Option';
        }
    }

    /** Get options under dropdown menu after clicking any option on the menu bar */
    /** @type {Promise<ElementFinder>} */
    /** @param {string} subOption option in menu bar*/
    /*Buttons can be selected no matter they are clicked or not*/
    getSubOptionFromMenubar(subOption) {
        // return element(by.xpath(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//a[child::div[text()='${subOption}']]`));
        return this.$(
            `//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]//a[child::div[text()='${subOption}']]`
        );
    }

    getSelectedPalette(subOption) {
        // return this.$$('.SwitchPalette').all(by.cssContainingText('.palette-name', subOption))[0];
        // return this.$$('.SwitchPalette').$(`.palette-name*=${subOption}`);
        return this.$(`//*[contains(@class, 'SwitchPalette')]//div[text()='${subOption}']//parent::a`);
    }

    getDropdownContainerFromMenubar() {
        // return element(by.xpath(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]`));
        return this.$(`//div[contains(@class, 'mstrmojo-ui-Menu-item-container')]`);
    }

    /**
     * Gets all palette elements from the format panel
     * @returns {Object} WebdriverIO elements array of palette items
     */
    getPaletteElements() {
        return this.$$('.item.SwitchPalette');
    }

    /**
     * Gets all palette names available in the format panel
     * @returns {Promise<Array<string>>} Array of palette names as strings
     */
    async getPaletteNames() {
        const paletteElements = await this.getPaletteElements();
        const names = [];

        for (const paletteElement of paletteElements) {
            const nameElement = await paletteElement.$('.palette-name');
            const name = await nameElement.getText();
            names.push(name);
        }

        return names;
    }

    /**
     * Checks if a specific palette is selected/checked
     * @param {string} paletteName - The palette name without any prefix (e.g., "rainy" not "(Default) rainy")
     * @returns {Promise<boolean>} - True if the palette is selected
     */
    async isPaletteChecked(paletteName) {
        const paletteElements = await this.getPaletteElements();

        for (const paletteElement of paletteElements) {
            const nameElement = await paletteElement.$('.palette-name');
            const fullName = await nameElement.getText();

            // Check if this is the palette we're looking for (ignoring any prefix)
            if (fullName.includes(paletteName)) {
                // Check if it has the "on" class indicating it's selected
                const classAttribute = await paletteElement.getAttribute('class');
                return classAttribute.includes('on');
            }
        }

        // If palette name not found
        return false;
    }

    /** From menu bar
     * @type {Promise<ElementFinder>} */
    getSaveDossierButton() {
        return this.$('.item.mb.save-dropdown .btn');
    }

    getDirectSaveDossierButton() {
        return this.$('.item.btn.save .btn');
    }

    getSaveDossierDropdownItem() {
        return this.$('.item.save1.mstrmojo-ui-Menu-item');
    }

    getSaveAndOpenDropdownItem() {
        return this.$('.item.saveAndOpen.mstrmojo-ui-Menu-item');
    }

    getSaveDossierFolderDialog() {
        // return element(by.xpath(`//div[@class='mstrmojo-Editor-title' and text()='Save Dossier']`));
        return this.$(`//div[@class='mstrmojo-Editor-title' and text()='Save Dashboard']`);
    }

    getSaveDossierFolderButton() {
        // return this.$('.mstrmojo-Button.mstrmojo-WebButton.hot.okButton');
        // return element(by.xpath(`//div[@class='mstrmojo-Button-text ' and text()='Save']`));
        return this.$(`//div[@class='mstrmojo-Button-text ' and text()='Save']`);
    }

    getSaveConfirmOverwriteDialog() {
        // return element(by.xpath(`//div[@class='mstrmojo-Editor-title' and text()='Confirm Overwrite']`));
        return this.$(`//div[@class='mstrmojo-Editor-title' and text()='Confirm Overwrite']`);
    }

    getSaveOverwriteButton() {
        // return element(by.xpath(`//div[@class='mstrmojo-Button-text ' and text()='Yes']`));
        return this.$(`//div[@class='mstrmojo-Button-text ' and text()='Yes']`);
    }

    getDossierSavedSuccessfullyDialog() {
        // return element(by.xpath(`//div[contains(@class,'save-successful-waitbox')]`));
        return this.$(`.ant-message-notice .ant-message-success`);
    }

    getSaveInProgressBox() {
        return this.$('.mstrmojo-Editor.mstrWaitBox.saving-in-progress');
    }

    getDossierNameInConfirmDialog(dossierName) {
        // return element(by.xpath(`//div[@class='mstrmojo-OBListItemText' and text()='${dossierName}']`))
        return this.$(`//div[@class='mstrmojo-OBListItemText' and text()='${dossierName}']`);
    }

    getSaveAsDossierButton() {
        return this.$('.item.saveAs');
    }

    /** Close Dossier button at top right corner
     * @type {Promise<ElementFinder>} */
    getCloseDossierButton() {
        return this.$('.item.btn.close');
        // return $(`div.item.btn.close div.btn div.icn`);
    }

    getEditorDialog() {
        // return element(by.xpath(`//div[contains(@class,'mstrmojo-ConfirmSave-Editor')]`));
        return this.$(`//div[contains(@class,'mstrmojo-ConfirmSave-Editor')]`);
    }

    getEditorDialogOption(option) {
        // return element(by.xpath(`//div[contains(@class,'mstrmojo-ConfirmSave-Editor')]//div[@class='mstrmojo-Button-text ' and text()=\"${option}\"]`));
        return this.$(
            `//div[contains(@class,'mstrmojo-ConfirmSave-Editor')]//div[@class='mstrmojo-Button-text ' and text()="${option}"]`
        );
    }

    getNotShowAgainCheckBox() {
        // return element(by.xpath(`//span[contains(@class, 'mstrmojo-CheckBox')]`));
        return this.$(`//span[contains(@class, 'mstrmojo-CheckBox')]`);
    }

    getLibraryIcon() {
        return this.$('.item.btn.library');
    }

    getDossierView() {
        return this.$('.mstrmojo-DocPanel-wrapper.mstrmojo-scrollbar-host');
    }

    getVizView() {
        return this.$('.gm-main-container');
    }

    getDoNotSaveButton() {
        // return element(by.xpath(`//div[contains(@class, 'nosave')]`));
        return this.$(`//div[contains(@class, 'nosave')]`);
    }

    getSaveAsEditor() {
        return this.$('.mstrmojo-SaveAsEditor');
    }

    getDossierNameInput() {
        return this.getSaveAsEditor().$('.mstrmojo-SaveAsEditor-nameInput');
    }

    getItemsInSaveAsEditor() {
        return this.$$('.mstrmojo-OBListItemText');
    }

    getSaveAsEditorSaveButton() {
        return this.getSaveAsEditor().$('.mstrmojo-Button.okButton');
    }
    // Toolbar buttons in dossier authoring page
    getToolbarBtnByName(buttonName) {
        /* Valid toolbar button names include: 'Table of Contents', 'Undo', 'Redo', 'Pause Data Retrieval', 'Refresh', 'Add Data', 'Add Chapter', 'Add Page',
        'Visualization', 'Filter', 'Text', 'Image', 'HTML Container', 'Shape', 'Panel Stack', 'Information Window', 'Save', 'More', 'Auto Dashboard' etc. */
        return this.$(
            `//div[@class='mstrmojo-RootView-toolbar']//div[@class='btn' and contains(string(), "${buttonName}")]//div[@class='icn']`
        );
    }

    getAutoDashboardWelcomePopup() {
        return this.$('.ai-assistant-tooltip');
    }

    getApplyButton() {
        return this.$('.item.btn.apply');
    }

    getDisabledApplyButton() {
        return this.$('.item.btn.apply.disabled');
    }

    getCancelButton() {
        return this.$('.item.btn.cancel');
    }

    // Get loading icon in dossier editor
    getWaitLoadingInEditor() {
        return this.$('//div[contains(@class, "mstrWaitBox") and contains(@style,"display: block;")]');
    }

    getWaitLoadingInEditorCancelButton() {
        return this.getWaitLoadingInEditor().$('//div[contains(@aria-label, "Cancel")]');
    }

    getAuthoringPageLocator(pageName) {
        return this.$(`//span[@class='txt undefined' and text()='${pageName}']`);
    }

    getDossierTitleText() {
        return this.$('.mstr-macro-texts');
    }

    getDossierTemplateIconInTitle() {
        return this.getDossierTitleText().$('.macro-template-icon');
    }

    getDossierCertifiedIconInTitle() {
        return this.getDossierTitleText().$('.macro-certified-icon');
    }

    getDossierCurrentName() {
        return this.getDossierTitleText().$('.macro-current-dossier-name').getText();
    }

    getDownloadButton() {
        return this.$('.item.download');
    }

    getSelectDatasetDiag() {
        return this.$('.mstrmojo-vi-dataset-picker.mstrmojo-vi-dataset-picker');
    }

    getSelectDatasetDiagSearch() {
        return this.getSelectDatasetDiag().$(`input[placeholder=' Search...']`);
    }

    getSelectDatasetDiagList() {
        return this.getSelectDatasetDiag().$('.mstrmojo-Booklet.mstrmojo-OB-booklet');
    }

    getFirstElementInSelectDatasetDiag() {
        return this.getSelectDatasetDiagList().$('.mstrmojo-ListBase2-itemsContainer').$('.mstrmojo-itemwrap');
    }

    getBtnInSelectDatasetDiag(button) {
        return this.getSelectDatasetDiag().$(`.mstrmojo-Button[aria-label='${button}']`);
    }

    getContextMenu() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getDatasetPanel() {
        return this.$('.mstrmojo-RootView-datasets');
    }

    getDatasetPanelMenuBtn() {
        return this.getDatasetPanel().$('.mstrmojo-VIPanel-titlebar.top').$('.mstrmojo-ListBase.mstrmojo-VIToolbar');
    }

    getDatasetByName(datasetName) {
        return this.getDatasetPanel().$(
            `//div[contains(@class, 'docdataset-unitlist-portlet') and descendant::div[text()='${datasetName}']]`
        );
    }

    getDatasetOptionBtn(datasetName) {
        return this.getDatasetByName(datasetName).$('.item.mnu');
    }

    getDatasetItem(datasetName, itemName) {
        return this.getDatasetByName(datasetName).$(`//div[span[text()='${itemName}']]`);
    }

    getMenuItem(menuItem) {
        return this.$(`//a[contains(@class, 'mstrmojo-ui-Menu-item')]/div[text()='${menuItem}']`);
    }

    getMenuItemParent(menuItem) {
        return this.$(`//div[text()='${menuItem}']/parent::a[contains(@class, 'mstrmojo-ui-Menu-item')]`);
    }

    getRefreshButtonOnToolbar() {
        return this.$('.item.btn.refresh');
    }

    getTabList() {
        return this.$$('.mstrmojo-VIIconTabList').filter(async (item) => item.isDisplayed())[0];
    }

    getTab(tab) {
        return this.getTabList()
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.toLowerCase() === tab;
            })[0];
    }

    getTocPanel() {
        return this.$('.mstrmojo-TableOfContents');
    }

    getDashboardPropertiesEditor() {
        return this.$('.mstrmojo-DocProps-Editor');
    }

    getDashboardExecutionMode() {
        return this.getDashboardPropertiesEditor().$(
            `.//div[text()="Execution mode"]/..//input[@id="execution_mode_onDemand_select"]`
        );
    }

    getDashboardPropertiesEditorButton(buttonName) {
        return this.getDashboardPropertiesEditor().$(
            `.//div[contains(@class,'mstr-docprops-buttonBar')]/button[text()='${buttonName}']`
        );
    }

    getDashbaordExecutionModeDropdown() {
        return this.$(
            `//div[@class='mstr-rc-base-theme-container']//div[contains(@class, 'mstr-rc-base-dropdown__dropdown-list')]`
        );
    }

    //eg. No Data Returned
    getCheckboxWithTitle(title) {
        return this.$$(
            `.//div[@class = 'mstr-docprops-label' and text() ='${title}']/ancestor::div[contains(@class,'mstr-docprops-row')]//div[contains(@class,'mstr-docprops-checkbox')]`
        )[0];
    }

    getNoDataReturnEditor() {
        return this.$('//div[contains(@class, "mstr-docprops-general-editor-container")]');
    }

    getNoDataTextArea() {
        return this.getNoDataReturnEditor().$('.//textarea');
    }

    getNoDataTextCount() {
        return this.getNoDataReturnEditor().$('.mstr-docprops-char-count');
    }

    //Format - bold/italic/underline
    getNoDataTextFormat(type) {
        const lowerType = type.toLowerCase();
        return this.getNoDataReturnEditor().$(
            `.//div[contains(@class, 'mstr-docprops-general-toolbar')]//button[contains(@class, 'mstr-docprops-general-toolbarButton') and translate(@aria-label, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = '${lowerType}']`
        );
    }

    getNoDataTextColorBtn() {
        return this.getNoDataReturnEditor().$(`.//div[contains(@class, 'color-picker-wrapper')]`);
    }

    getNoDataColorPickerPopup() {
        return this.$('.//dialog[contains(@class, "mstr-docprops-general-colorPicker-wrapper")]');
    }

    getNoDataColorInPicker(colorName) {
        return this.getNoDataColorPickerPopup().$(
            `.//button[contains(@class, 'mstr-rc-3-color-cell') and @title='${colorName}']`
        );
    }

    getNoDataResetBtn(enabled = true) {
        if (enabled) {
            return this.getNoDataReturnEditor().$(
                `.//button[contains(@class, 'mstr-docprops-general-refreshButton') and not(@disabled)]`
            );
        } else {
            return this.getNoDataReturnEditor().$(
                `.//button[contains(@class, 'mstr-docprops-general-refreshButton') and @disabled]`
            );
        }
    }

    getUnstructuredDataItem(index = 0) {
        return this.$$('.mstrmojo-ListBase mstrmojo-VIUnitList')[index];
    }

    getButtonWithLabel(label) {
        return this.$(`//button[@aria-label='${label}']`);
    }

    getTitleAndContainerFormatOption() {
        return this.$('div[aria-label="Title and Container"]');
    }

    getPanelStackHeader() {
        return this.$('.mstrmojo-PanelTabStrip');
    }

    getPanelStackBoxes() {
        return this.$$('.mstrmojo-PanelStackBox');
    }

    getMaxRestoreBtn() {
        return this.$('.hover-btn.hover-max-restore-btn.visible');
    }

    getTitleMaxRestoreBtn() {
        return this.$('.maximize.mstrmojo-UnitContainer-titleButton-small');
    }

    getPanelStackLeftArrow() {
        return this.$('.left-arrow-btn.visible');
    }

    getInfoWindowByLabelInLayersPanel(label = 'Information Window 1') {
        return this.$(`span[aria-label="${label}"]`);
    }

    getAllPanels() {
        return this.$$('.mstrmojo-DocPanel-wrapper.mstrmojo-scrollbar-host');
    }

    getFreeformLayoutPage() {
        return this.$('.mstrmojo-DocSubPanel-containerNode');
    }

    getToggleBar() {
        return this.$('.mstrmojo-RootView-togglebar');
    }

    get QueryDetailsCopyButton() {
        return this.$('//button[contains(@class, "mstr-SQLV-buttons-secondary") and @aria-label="Copy to Clipboard"]');
    }

    get QueryDetailsCloseBtn() {
        return this.$('//button[contains(@class, "mstr-SQLV-buttons-secondary") and @aria-label="Close"]');
    }

    get SuccessIcon() {
        return this.$('.success-icon');
    }

    get ToasterLabel() {
        return this.$('.mstr-SQLV-message-label');
    }

    get QueryDetailsContent() {
        return this.$('#sqlViewer .mstrmojo-Editor-content .mstr-SQLV-content-container');
    }

    async clickOnCheckboxWithTitle(title) {
        let el = await this.getCheckboxWithTitle(title);
        await this.waitForElementVisible(el);
        await this.click({ elem: el });
    }

    async clickOnExecutionMode() {
        await this.click({ elem: this.getDashboardExecutionMode() });
    }

    async clickOnDashboardPropertiesEditorButton(buttonName) {
        await this.click({ elem: this.getDashboardPropertiesEditorButton(buttonName) });
    }

    async clickTextFormatBtn(type) {
        await this.click({ elem: this.getNoDataTextFormat(type) });
    }

    async changeNoDataTextColor(color) {
        await this.click({ elem: this.getNoDataTextColorBtn() });
        await this.waitForElementVisible(this.getNoDataColorPickerPopup());
        await this.click({ elem: await this.getNoDataColorInPicker(color) });
        await this.click({ elem: this.getNoDataTextColorBtn() });
        await this.waitForElementInvisible(this.getNoDataColorPickerPopup());
    }

    async isNoDataFormatButtonSelected(type) {
        const element = await this.getNoDataTextFormat(type);
        const ariaPressed = await element.getAttribute('aria-pressed');
        return ariaPressed === 'true';
    }

    async inputNoDataText(text) {
        await this.waitForElementClickable(this.getNoDataTextArea());
        await this.baseFormatPanel.clearAndSetValue(this.getNoDataTextArea(), text);
        await this.sleep(0.5 * 1000);
    }

    async clickBtnWithLabel(label) {
        await this.click({ elem: this.getButtonWithLabel(label) });
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }

    // Action helper
    async waitForAuthoringPageLoading() {
        await this.waitForElementInvisible(this.getLoadingIcon());
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }

    async dismissAutoDashboardWelcomePopup() {
        const isDisplayed = await this.getAutoDashboardWelcomePopup().isDisplayed();
        if (!isDisplayed) return;
        await this.click({ elem: this.dashboardMenuBar.getTitleContainer() });
        await this.waitForElementInvisible(this.getAutoDashboardWelcomePopup());
    }

    async actionOnToolbar(buttonName) {
        if (buttonName === 'Apply') {
            await this.click({ elem: this.getApplyButton() });
        } else if (buttonName === 'Cancel') {
            await this.click({ elem: this.getCancelButton() });
        } else {
            await this.click({ elem: this.getToolbarBtnByName(buttonName) });
            if (['Undo', 'Redo', 'Resume Data Retrieval', 'Refresh'].indexOf(buttonName) >= 0) {
                await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            }
        }
    }
    /** Click action on the option on menu bar on web.
     * @param {string} menuOption options in menu bar. i.e. FILE, INSERT, FORMAT, SHARE, VIEW, HELP
     * @throws Exception
     */
    async actionOnMenubar(menuOption) {
        await this.click({ elem: this.getButtonFromMenubar(menuOption.toUpperCase()) });
    }
    async actionOnSubmenuNoContinue(subOption) {
        // Click on submenu option
        // Add Data under INSERT option has a second level suboption menu
        if (subOption.toLowerCase().includes('add data')) {
            await this.click({ elem: this.getSubOptionFromMenubar(subOption.split('->')[0].trim()) });
            await this.click({ elem: this.getSubOptionFromMenubar(subOption.split('->')[1].trim()) });
        } else {
            await this.click({ elem: this.getSubOptionFromMenubar(subOption) });
        }
        // For 'Send Now' and 'Schedule Delivery to E-mail', there is no waitBox in the new page
        if (subOption.indexOf('Send Now') == -1 && subOption.indexOf('E-mail') == -1) {
            await this.libraryAuthoringPage.waitLoadingDataPopUpIsNotDisplayed();
        }
    }

    /* Click action on the option on menu bar on web.
     * For "Add Data" under INSERT menu option, there is a second level sub option menu. Use '->' to separate the second level option
     * @param {string} menuOption options in menu bar. i.e. FILE, INSERT, FORMAT, SHARE, VIEW, HELP
     * @param {string} subOption options of the dropdown sub menu. e.g. New Dossier, Add Data -> New Data...
     * @throws Exception
     */
    async actionOnSubmenu(subOption, notShow = false) {
        // Click on submenu option
        await this.actionOnSubmenuNoContinue(subOption);
        if (await (await this.getEditorDialog()).isDisplayed()) {
            if (notShow) {
                await this.checkNotShowAgain();
            }
            await this.actionOnEditorDialog('Continue');
        }
    }

    /* Click action on the option on menu bar on web.
     * For "Add Data" under INSERT menu option, there is a second level sub option menu. Use '->' to separate the second level option
     * @param {string} menuOption options in menu bar. i.e. FILE, INSERT, FORMAT, SHARE, VIEW, HELP
     * @param {string} subOption options of the dropdown sub menu. e.g. New Dossier, Add Data -> New Data...
     * @throws Exception
     */
    async actionOnMenubarWithSubmenu(menuOption, subOption, seconds = 20, notShow = false) {
        // Click on menu option
        await this.actionOnMenubar(menuOption);
        await this.actionOnSubmenu(subOption, seconds, notShow);
    }

    async checkNotShowAgain() {
        await this.click({ elem: this.getNotShowAgainCheckBox() });
    }

    async actionOnEditorDialog(option) {
        await this.click({ elem: this.getEditorDialogOption(option) });
        await this.libraryAuthoringPage.waitLoadingDataPopUpIsNotDisplayed();
    }

    /**
     * Splits in JSON if attribute value in format "a:x;b:y;c:z;"
     * @param {WebElement} element to read attribute from
     * @param {strimg} attribute to read
     * @returns {Objct} structure from attribute if found
     */
    /** Close dossier */
    async clickCloseDossierButton() {
        await this.waitForElementClickable(this.getCloseDossierButton());
        await this.click({ elem: this.getCloseDossierButton() });
        await this.dossierPage.waitForDossierLoading();
        await this.sleep(3000);
    }

    async closeDossierWithoutSaving() {
        await this.click({ elem: this.getCloseDossierButton() });
        if (await this.alert.getTextButtonByName(`Don't Save`).isDisplayed()) {
            await this.click({ elem: this.alert.getTextButtonByName(`Don't Save`) });
            // await this.waitForElementVisible(this.dossierAuthoringPage.getWaitLoadingInEditor());
        }
        await this.sleep(2000);
        await this.waitForItemLoading();
    }

    async goToLibrary() {
        await this.click({ elem: this.getLibraryIcon() });
        await this.waitForItemLoading();
    }

    async saveNewObjectCommon(objectName, saveButton) {
        const timeout = 20000;
        await this.click({ elem: saveButton });
        await this.waitForElementVisible(this.getSaveAsEditor());
        await this.getDossierNameInput().setValue(objectName);
        await this.waitForElementVisible(this.getItemsInSaveAsEditor()[0]);
        await this.click({ elem: this.getSaveAsEditorSaveButton() });
        let isOverwriteDialogDisplay = await this.isMojoErrorPresent();
        let isSaveAsEditorDisplay = await this.getSaveAsEditor().isDisplayed();
        await browser.waitUntil(
            async () => {
                isOverwriteDialogDisplay = await this.isMojoErrorPresent();
                isSaveAsEditorDisplay = await this.getSaveAsEditor().isDisplayed();
                return isOverwriteDialogDisplay || !isSaveAsEditorDisplay;
            },
            {
                timeout: timeout,
                timeoutMsg: `Save As Editor is not closed after ${timeout}s`,
            }
        );
        if (isOverwriteDialogDisplay) {
            console.log('dup object name when create new object(dossier/bot/ADC)');
            await this.click({ elem: this.getMojoErrorConfirmButton() });
        }
        await this.waitForElementInvisible(this.getSaveAsEditor());
        await this.waitForElementInvisible(this.getWaitLoadingInEditor());
    }

    async saveNewObject(objectName) {
        let saveButton = await this.getSaveDossierButton();
        await this.saveNewObjectCommon(objectName, saveButton);
    }

    async saveNewADC(objectName) {
        let saveButton = await this.getDirectSaveDossierButton();
        await this.saveNewObjectCommon(objectName, saveButton);
    }

    async saveAsNewObject(objectName) {
        await this.actionOnMenubarWithSubmenu('File', 'Save As...');
        await this.waitForElementVisible(this.getSaveAsEditor());
        await this.getDossierNameInput().setValue(objectName);
        await this.click({ elem: this.getSaveAsEditorSaveButton() });
        let isOverwriteDialogDisplay = await this.isMojoErrorPresent();
        let isSaveAsEditorDisplay = await this.getSaveAsEditor().isDisplayed();
        await browser.waitUntil(
            async () => {
                isOverwriteDialogDisplay = await this.isMojoErrorPresent();
                isSaveAsEditorDisplay = await this.getSaveAsEditor().isDisplayed();
                return isOverwriteDialogDisplay || !isSaveAsEditorDisplay;
            },
            {
                timeout: 5000,
                timeoutMsg: 'Save As Editor is not closed after 5s',
            }
        );
        if (isOverwriteDialogDisplay) {
            console.log('dup object name when create new object(dossier/bot/ADC)');
            await this.click({ elem: this.getMojoErrorConfirmButton() });
        }
        await this.waitForElementInvisible(await this.getSaveAsEditor());
        await this.sleep(1000);
        await this.libraryAuthoringPage.libraryPage.dismissMissingFontPopup();
        await this.waitForAuthoringPageLoading();
    }

    async inputDossierNameAndSave(objectName) {
        await this.waitForElementVisible(this.getSaveAsEditor());
        await this.click({ elem: this.getDossierNameInput() });
        await this.clear({ elem: this.getDossierNameInput() });
        await this.getDossierNameInput().setValue(objectName);
        await this.click({ elem: this.getSaveAsEditorSaveButton() });
    }

    async saveNewDossier(dossierName) {
        await this.saveNewObject(dossierName);
        await this.click({ elem: this.getCloseDossierButton() });
    }

    /** Save Dossier */
    async clickSaveDossierButton(dossierName) {
        // await this.sleep(3 * 1000);
        await this.waitForElementClickable(this.getSaveDossierButton());
        await this.click({ elem: this.getSaveDossierButton() });
        await this.click({ elem: this.getSaveDossierDropdownItem() });
        await this.sleep(5000);
        if (await (await this.getDossierNameInConfirmDialog(dossierName)).isDisplayed()) {
            await this.click({ elem: this.getSaveDossierFolderButton() });
            await this.sleep(2000);
            await this.waitForElementClickable(this.getSaveOverwriteButton());
            await this.click({ elem: this.getSaveOverwriteButton() });
        }
        // else {
        //     await this.waitForElementVisible(this.getDossierNameInConfirmDialog('Waterfall'));
        //     await this.click({elem: this.getSaveDossierFolderButton()});
        //     await this.waitForElementClickable(this.getSaveOverwriteButton());
        //     await this.click({elem: this.getSaveOverwriteButton()});
        //     await this.waitForElementVisible(this.getDossierSavedSuccessfullyDialog());
        //     await this.sleep(2000);
        // }
        // await this.waitForElementVisible(this.getDossierSavedSuccessfullyDialog());
        await this.sleep(3000);
    }

    async clickSaveDossierButtonWithWait() {
        await this.waitForElementClickable(this.getSaveDossierButton());
        await this.click({ elem: this.getSaveDossierButton() });
        await this.waitForElementVisible(this.getDossierSavedSuccessfullyDialog());
        await this.sleep(3000);
    }

    async saveAndOpen() {
        await this.click({ elem: this.getSaveDossierButton() });
        await this.click({ elem: this.getSaveAndOpenDropdownItem() });
    }

    async clickToDismissPopups() {
        await this.click({ elem: this.getDossierTitleText() });
        await this.sleep(1000);
    }

    async refreshDossier() {
        await this.click({ elem: this.getRefreshButtonOnToolbar() });
        await this.waitForItemLoading();
    }

    async downLoadDossier() {
        await this.click({ elem: this.getDownloadButton() });
        await fixChromeDownloadDirectory();
    }

    // Assertion helper
    async isEditorWindowOpened() {
        return (await this.getEditorDialog()).isDisplayed();
    }

    async isPaletteSelected(subOption) {
        return (await this.getSelectedPalette(subOption)).isSelected();
    }

    async notSaveDossier() {
        return this.getDoNotSaveButton().click();
    }

    async searchSelectDataset(text) {
        await this.waitForElementVisible(this.getSelectDatasetDiag());
        await this.waitForDynamicElementLoading();
        await this.sleep(1000);
        const inputBox = this.getSelectDatasetDiagSearch();
        await this.click({ elem: inputBox });
        await inputBox.setValue(text);
        await this.enter();
        await this.sleep(1000); // wait for search result
        await this.loadingDialog.waitBooketLoaderIsNotDisplayed();
        await this.click({ elem: this.getFirstElementInSelectDatasetDiag() });
        await this.click({ elem: this.getBtnInSelectDatasetDiag('Select') });
        await this.waitForElementInvisible(this.$('.mstrmojo-Box.mstrIcon-wait'));
    }

    async searchDataset(text) {
        const inputBox = this.getSelectDatasetDiagSearch();
        await inputBox.setValue(text);
        await this.enter();
        await this.sleep(1000);
        await this.loadingDialog.waitBooketLoaderIsNotDisplayed();
        await this.sleep(1000);
    }

    async isDatasetlistEmpty() {
        return (await this.getFirstElementInSelectDatasetDiag().$('.mstrmojo-OBListItemText').getText()) === '(Empty)';
    }

    async getMenueItemCount() {
        return this.getContextMenu().$$('.mstrmojo-ui-Menu-item').length;
    }

    async openMenuByClick(el) {
        await el.click();
        await this.waitForElementVisible(await this.getContextMenu());
    }

    async isOptionExistInMenu(subOption) {
        return this.getSubOptionFromMenubar(subOption).isDisplayed();
    }

    async isOptionDisabledInMenu(subOption) {
        return this.isDisabled(this.getSubOptionFromMenubar(subOption));
    }

    async addExistingObjects() {
        await this.actionOnMenubarWithSubmenu('Insert', 'Add Data->Existing Objects...');
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async addNewSampleData(sampleDataIndex, prepare) {
        await this.actionOnMenubarWithSubmenu('Insert', 'Add Data->New Data...');
        await this.waitForElementVisible(this.datasetsPanel.getDIContainer());
        // await browser.pause(2000);
        await this.datasetsPanel.clickDataSourceByIndex(5);
        await this.datasetsPanel.importSampleFiles([sampleDataIndex], prepare);
    }

    async addNewSampleDataSaaS(sampleDataIndex, prepare) {
        await this.waitForElementVisible(this.datasetsPanel.getDIContainer());
        // await browser.pause(2000);
        await this.datasetsPanel.clickDataSourceByIndex(1);
        await this.datasetsPanel.importSampleFiles([sampleDataIndex], prepare);
    }

    async isApplyButtonDisabled() {
        return this.getDisabledApplyButton().isDisplayed();
    }

    async linkToOtherDataset(datasetName, itemName) {
        await expect(await this.getDatasetByName(datasetName).isExisting()).toBe(true);
        await this.waitForElementClickable(this.getDatasetItem(datasetName, itemName));
        await this.rightClick({ elem: this.getDatasetItem(datasetName, itemName) });
        await this.waitForElementClickable(this.getLinkToOtherDatasetButton());
        await this.getLinkToOtherDatasetButton().click();
    }

    async clickLoadingDataCancelButton() {
        await this.click({ elem: this.getWaitLoadingInEditorCancelButton() });
    }

    async switchToPanelTab(tab) {
        const selected = await this.isSelected(this.getTab(tab));
        if (!selected) {
            return this.click({ elem: this.getTab(tab) });
        }
    }

    /**
     * Gets all dataset names from the datasets panel
     * @returns {Promise<Array<string>>} Array of dataset names as strings
     */
    async getDatasetNamesInDatasetsPanel() {
        // Get all dataset containers
        const datasetContainers = await this.$$('.mstrmojo-VIPanel.docdataset-unitlist-portlet');
        const datasetNames = [];

        // Loop through each container to extract dataset names
        for (const container of datasetContainers) {
            // Find the editable label containing the dataset name
            const nameElement = await container.$('.mstrmojo-VIPanel-titlebar .mstrmojo-EditableLabel');
            if (nameElement) {
                const name = await nameElement.getText();
                // Only add non-empty names
                if (name && name.trim() !== '') {
                    datasetNames.push(name);
                }
            }
        }

        return datasetNames;
    }

    async addParameterToFilterPanel(name) {
        await this.rightClick({ elem: this.datasetsPanel.getDatasetElement(name) });
        await this.waitForElementVisible(this.getContextMenu());
        await this.click({ elem: this.getMenuItem('Add to Filter') });
    }

    async addParameterToParameterSelector(name, index) {
        await this.waitForDynamicElementLoading();
        await this.datasetPanel.switchDatasetsTab();
        await this.waitForElementClickable(this.datasetsPanel.getDatasetElement(name));
        await this.waitForElementClickable(this.inCanvasSelector.getParameterSelectorBoxByIndex(index));
        const fromElem = this.datasetsPanel.getDatasetElement(name);
        const toElem = this.inCanvasSelector.getParameterSelectorBoxByIndex(index);
        await this.dragAndDropForAuthoring({ fromElem, toElem });
        await this.waitForDynamicElementLoading();
        await this.sleep(2000);
    }

    async addDatasetElementToDropzone(name, dropzoneName) {
        await this.switchToPanelTab('editor');
        const fromElem = this.datasetsPanel.getDatasetElement(name);
        const toElem = this.editorPanel.getDropZone(dropzoneName);
        await this.dragAndDropForAuthoring({ fromElem, toElem });
    }

    async isDatasetElementPresent(name) {
        await this.switchToPanelTab('editor');
        const el = this.datasetsPanel.getDatasetElement(name);
        return el.isDisplayed();
    }

    async deleteUnstructuredDataItem(name) {
        await this.datasetsPanel.rightClickAttributeMetricByName(name);
        await this.datasetsPanel.actionOnMenu('Remove');
    }

    async hoverOnPanelStack() {
        const panelStacks = await this.getPanelStackBoxes();
        console.log('Panel stacks: ', panelStacks.length);
        const lastPanel = panelStacks[panelStacks.length - 1];
        if (await lastPanel.isDisplayed()) {
            await this.hover({ elem: lastPanel });
        } else {
            const firstPanel = panelStacks[0];
            await this.hover({ elem: firstPanel });
        }
    }

    async hoverOnVisualizationByLabel(label = 'Visualization 1 copy') {
        const element = await $(`[aria-label="${label}"]`);
        if (await element.isDisplayed()) {
            await this.hover({ elem: element });
        } else {
            throw new Error(label + ' is not displayed');
        }
    }

    async clickVisualizationByLabel(label = 'Visualization 1 copy') {
        const element = await $(`[aria-label="${label}"]`);
        if (await element.isDisplayed()) {
            await this.click({ elem: element });
        } else {
            throw new Error(label + 'is not displayed');
        }
    }

    async clickMaxRestoreBtn() {
        await this.click({ elem: this.getMaxRestoreBtn() });
    }

    async clickTitleMaxRestoreBtn() {
        await this.click({ elem: this.getTitleMaxRestoreBtn() });
    }

    async openPanelStackTitleContainerFormatPanel() {
        await this.click({ elem: this.getTitleAndContainerFormatOption() });
        await this.waitForElementInvisible(this.getWaitLoadingInEditor());
    }

    async openInfoWindowContainerFormatPanel() {
        await this.click({ elem: this.getInfoWindowByLabelInLayersPanel().$('..') });
        await this.click({ elem: this.getTitleAndContainerFormatOption() });
        await this.waitForElementInvisible(this.getWaitLoadingInEditor());
    }

    async isBtnDisabled(buttonName) {
        const btnParent = await this.getParent(this.getToolbarBtnByName(buttonName));
        const btnParent2 = await this.getParent(btnParent);
        return this.isDisabled(btnParent2);
    }

    async getTitleBarSetting() {
        return this.$(`.//span[text()="Title Bar"]/ancestor::div[@class="mstrrsd-vertical-container"]`);
    }

    async getTitleStyle(value) {
        return this.$(`.//span[text()="${value}"]/parent::*//span[contains(@class,"ant-radio-button-checked")]`);
    }

    async setTitleStyle(value) {
        const titleBarSetting = await this.getTitleBarSetting();
        await this.click({ elem: titleBarSetting.$(`.//span[text()="${value}"]`) });
        await this.waitForElementInvisible(this.getWaitLoadingInEditor());
    }

    async getTitleFontFamily(line) {
        const fontElem = await this.$(
            `.//span[text()="${line}"]/../../../..//div[@class="mstr-editor-font-select"]//div[contains(@style,'font-family')]`
        );
        const fontFamily = await fontElem.getText();
        console.log('font family: ', fontFamily);
        return fontFamily;
    }

    async getTitleFontSize(line) {
        const fontSizeElem = await this.$(
            `.//span[text()="${line}"]/../../../..//div[contains(@class,"size-and-color")]//div[@class="mstr-editor-input-number"]//input`
        );
        return await fontSizeElem.getValue();
    }

    async getTitleFontColor(line) {
        const colorElem = await this.$(
            `.//span[text()="${line}"]/../../../..//div[contains(@class,"size-and-color")]//div[contains(@class,"mstr-color-picker-dropdown")]//div[contains(@style,'background-color')]`
        );
        const color = await colorElem.getCSSProperty('background-color');
        console.log('font color: ', color.value);
        return color.value;
    }

    async switchPageInAuthoring(pageName) {
        await this.click({ elem: this.getAuthoringPageLocator(pageName) });
        await this.waitForElementInvisible(this.getWaitLoadingInEditor());
    }

    async copyQueryDetails() {
        await this.click({ elem: this.QueryDetailsCopyButton });
    }

    async closeQueryDetail() {
        await this.click({ elem: this.QueryDetailsCloseBtn });
        await this.waitForElementInvisible(this.QueryDetailsContent);
    }

    /**
     * Returns the change view mode button instance
     * @returns {Promise<WebdriverIO.Element>}
     */
    getChangeViewModeButton() {
        return this.$('.item.changeViewMode');
    }

    /**
     * Gets the current change view mode label displayed in the toolbar
     * @returns {Promise<string>}
     */
    async getCurrentChangeViewModeText() {
        const button = await this.getChangeViewModeButton();
        await button.waitForExist({ timeout: 5000 });

        const label = await button.$('.btn .text');
        await label.waitForExist({ timeout: 5000 });

        const text = await label.getText();
        return text.trim();
    }

    getViewModeDropDownList() {
        return this.$(
            "(//div[contains(@class,'mstrmojo-ListBase') and contains(@class,'mstrmojo-ui-Menu') and contains(@class,'vi-toolbarMenu') and contains(@class,'visible')])[last()]"
        );
    }

    async clickChangeViewModeButton() {
        const button = await this.getChangeViewModeButton();
        await this.click({ elem: button });
    }

    async changeViewModeTo(optionText) {
        await this.clickChangeViewModeButton();

        const menu = await this.getViewModeDropDownList();
        await this.waitForElementVisible(menu);

        const sanitizedOption = optionText.replace(/'/g, "\\'");
        const option = await menu.$(
            `.//a[contains(@class,'mstrmojo-ui-Menu-item') and .//div[contains(@class,'mtxt') and normalize-space(text())='${sanitizedOption}']]`
        );
        await option.waitForClickable({ timeout: 5000 });

        await this.click({ elem: option });
        await this.waitForElementInvisible(menu);
        await this.waitForElementInvisible(this.getWaitLoadingInEditor());
    }

    /**
     * Returns the page size button instance
     * @returns {Promise<WebdriverIO.Element>}
     */
    getPageSizeButton() {
        return this.$('.item.pageSetting');
    }

    /**
     * Clicks the page size button to expose sizing options
     * @returns {Promise<void>}
     */
    async clickPageSizeButton() {
        const button = await this.getPageSizeButton();
        await this.click({ elem: button });
    }

    /**
     * Returns the currently visible page size dropdown menu
     * @returns {Promise<WebdriverIO.Element>}
     */
    getPageSizeMenu() {
        return this.$("(//div[contains(@class,'pageSizeMenu') and contains(@class,'visible')])[last()]");
    }

    /**
     * Returns the page size entry shown under the More options menu
     * @returns {Promise<WebdriverIO.Element>}
     */
    getPageSizeItemInMoreOptions() {
        return this.$("//a[contains(@class,'pageSetting') and contains(@class,'mstrmojo-ui-Menu-item')]");
    }

    /**
     * Clicks the page size entry from the More options menu
     * @returns {Promise<void>}
     */
    async clickPageSizeFromMoreOptions() {
        const pageSizeItem = await this.getPageSizeItemInMoreOptions();
        await this.waitForElementVisible(pageSizeItem);
        await this.click({ elem: pageSizeItem });
    }

    /**
     * Chooses a page size option by its label
     * @param {string} optionText
     * @returns {Promise<void>}
     */
    async selectPageSize(optionText) {
        const menu = await this.getPageSizeMenu();
        await this.waitForElementVisible(menu);

        const sanitizedOption = optionText.replace(/'/g, "\\'");
        const option = await menu.$(
            `.//a[contains(@class,'mstrmojo-ui-Menu-item') and .//div[contains(@class,'mtxt') and normalize-space(text())='${sanitizedOption}']]`
        );
        await option.waitForClickable({ timeout: 5000 });

        await this.click({ elem: option });
        await this.waitForElementInvisible(menu);
        await this.waitForElementInvisible(this.getWaitLoadingInEditor());
    }

    async closeSavedSuccessfullyToast() {
        const toast = await this.getDossierSavedSuccessfullyDialog();

        const toastExists = await toast.isExisting().catch(() => false);
        if (!toastExists) {
            return;
        }

        const toastVisible = await toast
            .waitForDisplayed({ timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        if (!toastVisible) {
            return;
        }

        const closeButton = await this.antdMessage.getAntdMessageCloseButton();
        const closeButtonExists = await closeButton.isExisting().catch(() => false);
        if (!closeButtonExists) {
            return;
        }

        const canClick = await closeButton
            .waitForClickable({ timeout: 2000 })
            .then(() => true)
            .catch(() => false);
        if (!canClick) {
            return;
        }

        await this.click({ elem: closeButton });
        await toast.waitForDisplayed({ timeout: 3000, reverse: true }).catch(() => undefined);
    }
}
