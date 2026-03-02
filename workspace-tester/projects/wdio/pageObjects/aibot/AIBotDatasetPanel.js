import BasePage from '../base/BasePage.js';
import { newDIUILabels } from '../../constants/bot.js';
import { createXPathForElementSvg } from './utils.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import BaseBotConfigTab from '../base/BaseBotConfigTab.js';
import LibraryAuthoringPage from '../library/LibraryAuthoringPage.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class AIBotDatasetPanel extends BaseBotConfigTab {
    static TIMEOUT = 60 * 1000;

    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
        this.libraryAuthoringPage = new LibraryAuthoringPage();
    }

    //Element locator

    getDatasetPanel() {
        return this.$('.mstr-ai-chatbot-Datasets');
    }

    getDatasetPanelTitle() {
        return this.$('.mstr-ai-chatbot-Datasets-title');
    }

    getDatasetPanelDatasetTitle(index = 0) {
        return this.$$('.mstr-ai-chatbot-Datasets-dataset-title-label')[index];
    }

    getUnstructuredDataItem(index = 0) {
        return this.$$('.mstr-ai-chatbot-unstructured-data-item')[index];
    }

    async getDatasetPanelDatasetTitleName(index = 0) {
        const name = await this.getDatasetPanelDatasetTitle(index);
        return name.getText();
    }

    getUnstructuredDataItemName(index = 0) {
        return this.getUnstructuredDataItem(index).$('span');
    }

    async getUnstructuredDataItemNameText(index = 0) {
        const name = await this.getUnstructuredDataItemName(index);
        return name.getText();
    }

    getSearchIcon() {
        return this.$('.mstr-icons-lib-icon');
    }

    getSearchContainer() {
        return this.$('.mstr-ai-chatbot-SearchBox');
    }

    getSearchInput() {
        return this.getSearchContainer().$('input[type="search"]');
    }

    getSearchInReplaceDialogContainer() {
        return this.$('.mstr-input-container');
    }

    getSearchInReplaceDialog() {
        return this.getSearchInReplaceDialogContainer().$('input[aria-label="Search Input"]');
    }

    getClearSearchIcon() {
        return this.$('.mstr-ai-chatbot-SearchBox-clear');
    }

    getCollapseArrow() {
        return this.$('.mstr-ai-chatbot-Collapsible-arrow');
    }

    getFolderCollapseArrow(name) {
        return this.$(`.mstr-ai-chatbot-FolderTreeRow-arrowIconWrapper[aria-label='${name}-arrow']`);
    }

    getDatasetNameInput() {
        return this.$('.mstr-ai-chatbot-Datasets-dataset-title-input');
    }

    getRenameError() {
        return this.$('.mstr-ai-chatbot-Toast-title');
    }

    getMenuButton() {
        return this.$('.single-icon-misc-menu');
    }

    getDatasetContainerByName(name) {
        return browser.$(
            `//div[contains(text(), '${name}')]/ancestor::div[contains(@class, 'mstr-ai-chatbot-Collapsible')]`
        );
    }

    getMenuButtonForDataset(datasetContainer) {
        return datasetContainer.$('div.mstr-ai-chatbot-Datasets-menu button.IconButton');
    }

    getWaringIconForDataset(datasetContainer) {
        return datasetContainer.$('.mstr-ai-chatbot-Datasets-dataset-warning');
    }

    getWarningIconForBot(botContainer) {
        return botContainer.$('.mstr-ai-chatbot-Datasets-data-source-bot-warning');
    }

    getWarningIconsCount() {
        return this.$$('.mstr-ai-chatbot-Datasets-dataset-warning').length;
    }

    getArrowButtonForDatasetContainer(datasetContainer) {
        return datasetContainer.$('div.mstr-ai-chatbot-Collapsible-arrow');
    }

    getMenuContainer() {
        return this.$('.mstr-ai-chatbot-Datasets-menu-content');
    }

    getNoContentMessage(index = 0) {
        return this.$$('.mstr-ai-chatbot-Datasets-noContent')[index];
    }

    getSelectBox(elem) {
        return this.$(`button.mstr-ai-chatbot-Checkbox-box[aria-label='${elem}']`);
    }

    getSelectBoxInFolder(elem) {
        return this.$(`button.mstr-ai-chatbot-Checkbox-box[aria-label='${elem}-checkbox']`);
    }

    getSelectBotStatus(elem) {
        return this.getSelectBox(elem).getAttribute('aria-checked');
    }

    getSelectBoxStatusInFolder(elem) {
        return this.getSelectBoxInFolder(elem).getAttribute('aria-checked');
    }

    getDatasetList() {
        return this.$('.mstr-ai-chatbot-Datasets-list');
    }

    getDatasetContainer() {
        return this.$('.mstr-ai-chatbot-Collapsible-content');
    }

    getManipulateDatasetButton(button) {
        return this.$$('.mstr-ai-chatbot-Datasets-menu-item').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === button;
        })[0];
    }

    getErrorIcon() {
        return this.$('.mstr-ai-chatbot-Datasets-dataset-warning');
    }

    getLinkIcon() {
        return this.$$('.mstr-ai-chatbot-Datasets-object-link-icon')[0];
    }

    getPanelErrorIcon() {
        return this.$('.mstr-ai-chatbot-ConfigTabs-dataset-warning');
    }

    getTooltipContainer() {
        return this.$('.mstr-ai-chatbot-LayoutContainer-overlay');
    }

    getReplaceDialogHeader() {
        return this.$('.mstr-ai-chatbot-Dialog-header');
    }

    getRefreshContainer() {
        return this.$('.mstrmojo-di-tablestatuslist ');
    }

    getReplacePageButton(button) {
        return this.$$('.mstr-rc-overflow-tooltip__child-container').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === button;
        })[0];
    }

    getDatasetWarningDialog() {
        return this.$('.mstr-ai-chatbot-DatasetWarningDialog-container');
    }

    getDatasetWarningDialogHeader() {
        return this.$('.mstr-ai-chatbot-DatasetWarningDialog-header');
    }

    getCloseBtnInWarningDialog() {
        return this.$('button*=Close');
    }

    getDataPanelContainer() {
        return this.$('.mstr-ai-chatbot-Datasets');
    }

    getDataSortBy(text) {
        return this.$$('.ag-header-cell-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getReplaceLoadingIcon() {
        return this.$('.react-bot-creator-preloader-wrapper');
    }

    getReplaceSecondLoadingIcon() {
        return this.$('.mstr-react-dossier-creator-preloader.preloader-wrapper');
    }

    getSelectCount() {
        return this.$('.template-info-selection-count');
    }

    getDatasetNameContainer() {
        return this.$('.mstr-ai-chatbot-Datasets-dataset-title');
    }

    getModeSwitcher() {
        return this.$('.mode-switcher');
    }

    getDataSetInReplace(name) {
        return this.$(`span.ws-object-name-text=${name}`);
    }

    getDatasetInSearchResult(name) {
        return this.$$(`span.ws-object-name-text=${name}`)[0];
    }

    getRefreshPage() {
        return this.$('.mstrmojo-Editor-title-container');
    }

    getMojoPageButton(button) {
        return this.$$('.mstrmojo-Button-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === button;
        })[0];
    }

    getRefreshDoneIcon() {
        return this.$('.mstrmojo-Label.republish-status-icon.finished');
    }

    getEditPage() {
        return this.$('.mstrmojo-di-view.mojo-theme-light.mstrmojo-di-view-popup');
    }

    getEditTitle() {
        return this.$('#DIContainer');
    }

    getNewDIPageSearch() {
        return this.$('.whc-search-box.mini-toolbar-searchbox');
    }

    getNewDIPage() {
        return this.$('.mstrmojo-di-popup');
    }

    getImportDataType(text) {
        return this.$$('.mstr-datasource-custom-row-text').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getSampleFileContentContainer() {
        return this.$('.mstrmojo-DataGrid.mstrmojo-di-samplefiles .mstrmojo-itemwrap-table');
    }

    getChooseFile(text) {
        return this.$$('.mstrmojo-CheckBox.mstrmojo-ImageCheckBox').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getSelectAllInRefresh() {
        return this.$('.mstrmojo-Label.tristate.tablestatus-header.refresh');
    }

    getSearchBoxInEdit() {
        return this.$('.mstrmojo-Box.mstrmojo-di-DISearchTableBox');
    }

    getChooseTableInNewDI(text) {
        return this.$$('.oqWD84YIysOxzu3Ypb5Q').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getDataName(data) {
        return this.$$('.mstr-ai-chatbot-DatasetObject-object-name').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === data;
        })[0];
    }

    getDataContainName(data) {
        return this.$$('.mstr-ai-chatbot-DatasetObject-object-name').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(data);
        });
    }

    getObjectNameFromDataset(dataset, object) {
        return this.$(
            `//div[text()='${dataset}']/ancestor::button/following-sibling::div//span[@class='mstr-ai-chatbot-DatasetObject-object-name']//span[text()='${object}']`
        );
    }

    getDatasetMenuItem(text) {
        return this.$('.mstr-ai-chatbot-Datasets-menu-content').$(`div.mstr-ai-chatbot-Datasets-menu-item=${text}`);
    }

    getDataContextMenu() {
        return this.$('.mstr-ai-chatbot-ContextMenu-content');
    }

    getDatasetObjectContextMenu() {
        return this.$('.mstr-ai-chatbot-DatasetObjectMenu-menu');
    }

    getDeleteTableButton(elem) {
        return this.$(
            `button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-kmpmrw[aria-label='${elem}']`
        );
    }

    getUploadFilePage() {
        return this.$('.mstrmojo-di-view.mstrmojo-di-view-popup');
    }

    getTable() {
        return this.$('#mstr696').$('.mstrmojo-di-tv-header').$('span.di-item-mn');
    }

    getAddButtonElement() {
        return this.$(() =>
            Array.from(document.querySelectorAll('div.mstrmojo-Button-text')).find(
                (el) => el.textContent === 'Add/Edit Tables'
            )
        );
    }

    getFileSamplePage(title) {
        return this.$(`.mstrmojo-Label.mstrmojo-di-title[aria-label='${title}']`);
    }

    getAdvancedModeButton() {
        return this.$('.mstr-ai-chatbot-Datasets-titlebar .mstr-ai-chatbot-Button');
    }

    getDatasetCount() {
        return this.$$('.mstr-ai-chatbot-Datasets-dataset-mainview').length;
    }

    getAdvancedContainer() {
        return this.$('.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-secondary');
    }

    getCheckBoxInSearchResult(name) {
        return browser
            .$(`//mark[contains(text(), '${name}')]/ancestor::div[contains(@class, 'ag-cell-wrapper')]`)
            .$('.ag-checkbox');
    }

    getCoverSpinner() {
        return this.$('.mstr-ai-chatbot-Spinner');
    }

    getDatasetTitle(name) {
        return browser.$(
            `//div[contains(text(), '${name}')]/ancestor::div[contains(@class, 'mstr-ai-chatbot-Datasets-dataset-title')]`
        );
    }

    getDatasetNameElement(index = 0) {
        return this.$$('.mstr-ai-chatbot-Datasets-dataset-title-label')[index];
    }

    getDataRenameInput() {
        return this.$(`//input[@data-feature-id='aibot-edit-dataset-object-name-input']`);
    }

    getMenuItemElement(text) {
        return this.$(`//div[contains(@class,'mstr-ai-chatbot-ContextMenu-item') and contains(text(), '${text}')]`);
    }

    getMenuItemInDatasetDialog(text) {
        return this.$$('.ant-menu-title-content').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === text;
        })[0];
    }

    getMenuItemInDatasetObjectDialog(text) {
        return this.$$('.mstr-ai-chatbot-DatasetObjectMenu-item,.mstr-ai-chatbot-DatasetObjectMenu-subTrigger').filter(
            async (elem) => {
                const elemText = await elem.getText();

                return elemText && elemText.includes(text);
            }
        )[0];
    }

    getAttributeFormCheckboxByFormName(formName) {
        return this.$(`//label[text()='${formName}']/parent::div//button[contains(@class,'Checkbox')]`);
    }

    getCheckboxByDatasetObjectName(objectName) {
        return this.$(
            `//span[text()='${objectName}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-Datasets-dataset-object')]//button[contains(@class, 'mstr-ai-chatbot-Checkbox-box')]`
        );
    }

    getNerSwitchByDatasetObjectName(objectName) {
        return this.$(
            `//span[text()='${objectName}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-Datasets-dataset-object')]//div[contains(@class, 'mstr-ai-chatbot-Datasets-dataset-object-form')]`
        );
    }

    getNerSwitchSpinnerByDatasetObjectName(objectName) {
        return this.$(
            `//span[text()='${objectName}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-Datasets-dataset-object')]//div[contains(@class, 'mstr-ai-chatbot-Spinner')]`
        );
    }

    getNerCurtainByDatasetObjectName(datasetName, objectName) {
        return this.getDatasetObject(datasetName, objectName).$('.mstr-ai-chatbot-DatasetObject-ner-spinner-wrapper');
    }

    getNerEnabledMark(datasetName, objectName) {
        return this.getDatasetObject(datasetName, objectName).$('.mstr-ai-chatbot-DatasetObject-ner-enabled-label');
    }

    getNerWarningMark(datasetName, objectName) {
        return this.getDatasetObject(datasetName, objectName).$('.mstr-ai-chatbot-Datasets-dataset-warning');
    }

    getAttributeFormExampleByFormName(formName) {
        return this.$(
            `//label[text()='${formName}']/parent::div/following-sibling::div[contains(@class, 'AttributeFormsSelector-example')]`
        ).getText();
    }

    getOKButtonInAttributeForms() {
        return this.$('.mstr-ai-chatbot-AttributeFormsSelector-actions .mstr-ai-chatbot-Button--theme-primary');
    }

    getElementByName(type, name) {
        return this.getDatasetContainer().$(
            `//span[div[div[${createXPathForElementSvg(type)}/following-sibling::span/span[text()="${name}"]]]]`
        );
    }

    getElementsWithSpecificType(type) {
        return this.getDatasetContainer().$$(`//span[div[div[${createXPathForElementSvg(type)}]]]`);
    }

    getElementById(type, index) {
        return this.getElementsWithSpecificType(type)[index];
    }

    getUpdateDatasetButton() {
        return this.$('.mstr-ai-chatbot-Datasets-addDataset');
    }

    getDuplicateNameAlertContainer() {
        return this.$('.mstr-ai-chatbot-DuplicateNameDialog-text');
    }

    getShowDescriptionToggle() {
        return this.$('[id="dataset_panel_show_object_descriptions_switch"]');
    }

    getShowDescriptionLabel() {
        return this.$('[id="dataset_panel_show_object_description_switch_label"]');
    }

    getDatasetSelector() {
        return this.$('.mstr-ai-chatbot-Select-selectTrigger');
    }

    getDatasetSelectorText() {
        return this.getDatasetSelector().$('span');
    }

    getDatasetDescription(datasetName) {
        const DBcontainer = this.getDatasetContainerByName(datasetName);
        // DBcontainer's first description is description of the DB itself.
        return DBcontainer.$('.mstr-ai-chatbot-Datasets-description');
    }

    getDatasetDescriptionTextArea(datasetName) {
        return this.getDatasetDescription(datasetName).$('.mstr-ai-chatbot-Textarea');
    }

    getObjectDescription(datasetName, objectName) {
        const DBcontainer = this.getDatasetContainerByName(datasetName);
        const xpath = `//span[contains(@class, 'mstr-ai-chatbot-DatasetObject-object-name')]//span[text()='${objectName}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-Datasets-dataset-object')]/following-sibling::div[contains(@class, 'mstr-ai-chatbot-Datasets-description')]`;
        return DBcontainer.$(`${xpath}`);
    }

    getDatasetObject(datasetName, objectName) {
        const el = this.getDatasetContainerByName(datasetName);
        return el.$$('.mstr-ai-chatbot-Datasets-dataset-object').filter(async (elem) => {
            const elemText = await elem.$('.mstr-ai-chatbot-DatasetObject-object-name').getText();
            return elemText === objectName;
        })[0];
    }

    getDatasetObjectMenuIcon(datasetName, itemName) {
        return this.getDatasetObject(datasetName, itemName).$('.mstr-ai-chatbot-DropdownMenu');
    }

    getDatasetObjectLinkIcon(datasetName, itemName) {
        return this.getDatasetObject(datasetName, itemName).$('.mstr-ai-chatbot-Datasets-object-link-icon');
    }
    getBotContainers() {
        return this.$$('.mstr-ai-chatbot-Datasets-data-source-bot-mainview');
    }

    getBotContainerByName(botName) {
        return this.getBotContainers().filter(async (elem) => {
            const elemText = await elem.$('.mstr-ai-chatbot-Datasets-data-source-bot-name').getText();
            return elemText === botName;
        })[0];
    }

    getBotHeader(botName) {
        return this.getBotContainerByName(botName).$('.mstr-ai-chatbot-Datasets-data-source-bot-header');
    }

    getBotDescription(botName) {
        return this.getBotContainerByName(botName).$('.mstr-ai-chatbot-Datasets-description');
    }

    getBotDescriptionTextArea(botName) {
        return this.getBotDescription(botName).$('.mstr-ai-chatbot-Textarea');
    }

    getObjectDescriptionTextArea(datasetName, objectName) {
        return this.getObjectDescription(datasetName, objectName).$('.mstr-ai-chatbot-Textarea');
    }

    getSearchBox() {
        return this.$('.mstr-ai-chatbot-SearchBox input[type="search"]');
    }

    getNoMatchContent() {
        return this.$('.mstr-ai-chatbot-Datasets-noContent');
    }

    getDatasetDropdownIcon() {
        return this.$('.mstr-ai-chatbot-Select-selectIcon');
    }

    // menu item to select dataset in a dropdown list.
    getDatasetOption(datasetName) {
        return this.$(
            `//div[(@data-feature-id="aibot-edit-datasets-selector-option-v2" or @data-feature-id="aibot-edit-datasets-selector-option-select-all-v2") and .//div[text()="${datasetName}"]]`
        );
    }

    getAddNewBotButton() {
        return this.$('.mstr-ai-chatbot-Datasets-addBotText');
    }

    // column alias
    getObjectAliasComponent(datasetName, objectName) {
        const DBcontainer = this.getDatasetContainerByName(datasetName);
        const xpath = `//span[contains(@class, 'mstr-ai-chatbot-DatasetObject-object-name')]//span[text()='${objectName}']/ancestor::div[contains(@class, 'mstr-ai-chatbot-Datasets-dataset-object')]/following-sibling::div[contains(@class, 'mstr-ai-chatbot-ColumnAliasComponent')]`;
        return DBcontainer.$(`${xpath}`);
    }

    getAliasInput() {
        return this.$('input[data-feature-id="aibot-edit-dataset-bot-object-alias-input"]');
    }

    getAliasTagByName(dataName, objectName, aliasName) {
        const aliasComponent = this.getObjectAliasComponent(dataName, objectName);
        return aliasComponent.$(
            `.//span[@class="mstr-ai-chatbot-TagsPreview-capsule"][.//span[text()="${aliasName}"]]`
        );
    }

    getAliasTagByNameInInput(aliasName) {
        return this.$(`//span[@class="mstr-ai-chatbot-TagsInput-tag-text" and text()="${aliasName}"]`);
    }

    getAliasTagDeleteButton(datasetName, objectName, aliasName) {
        const aliasTag = this.getAliasTagByName(datasetName, objectName, aliasName);
        return aliasTag.$('span[data-feature-id="aibot-edit-dataset-bot-object-alias-delete"]');
    }

    getAliasTagDeleteButtonInInput(aliasName) {
        const aliasTag = this.getAliasTagByNameInInput(aliasName);
        return aliasTag.$('./following-sibling::span[@data-feature-id="aibot-edit-dataset-bot-object-alias-delete"]');
    }

    // bot alias
    getBotAliasContainer(botName) {
        return this.getBotContainerByName(botName).$('.mstr-ai-chatbot-Datasets-data-source-bot-alias');
    }

    getBotAliasInputbot(botName) {
        return this.getBotAliasContainer(botName).$('.mstr-ai-chatbot-Datasets-data-source-bot-alias-input');
    }

    getBotAliasPreview(botName) {
        return this.getBotAliasContainer(botName).$('.mstr-ai-chatbot-Datasets-data-source-bot-alias-preview');
    }

    getBotAliasWarning() {
        return this.$('.mstr-ai-chatbot-Datasets-data-source-bot-alias-warning');
    }

    // Actions helper
    async openDatasetContextMenuV2(datasetName, universalBot = false) {
        // Find the dataset container first
        let datasetContainer;
        if (universalBot) {
            datasetContainer = await this.getBotContainerByName(datasetName);
        } else {
            datasetContainer = await this.getDatasetContainerByName(datasetName);
        }
        if (!(await datasetContainer.isDisplayed())) {
            throw new Error(`Dataset ${datasetName} is not displayed`);
        }

        // Find the context menu trigger within the dataset title area
        let contextMenuTrigger;
        if (universalBot) {
            contextMenuTrigger = await datasetContainer.$(
                '[data-feature-id="aibot-edit-datasets-subbot-item-context-menu-trigger-v2"]'
            );
        } else {
            contextMenuTrigger = await datasetContainer.$(
                '[data-feature-id="aibot-edit-datasets-item-context-menu-trigger-v2"]'
            );
        }

        if (await contextMenuTrigger.isDisplayed()) {
            await contextMenuTrigger.click();
        } else {
            throw new Error(`Context menu trigger for dataset ${datasetName} is not displayed`);
        }
    }

    async openDatasetObjectContextMenuV2(datasetName, objectName) {
        const datasetObject = await this.getDatasetObject(datasetName, objectName);
        await datasetObject.scrollIntoView();
        if (!(await datasetObject.isDisplayed())) {
            throw new Error(`Dataset object ${objectName} in dataset ${datasetName} is not displayed`);
        }
        await this.click({ elem: this.getDatasetObjectMenuIcon(datasetName, objectName) });
        await this.waitForElementVisible(this.getDatasetObjectContextMenu());
    }

    async clickDatasetContextMenuItem(text) {
        const menuItem = await this.getDatasetMenuItem(text);
        if (await menuItem.isDisplayed()) {
            await menuItem.click();
        } else {
            throw new Error(`Menu item "${text}" is not displayed`);
        }
    }

    async clickDatasetObjectContextMenu(firstOption, secondOption) {
        const firstMenuItem = await this.getMenuItemInDatasetObjectDialog(firstOption);
        await this.click({ elem: firstMenuItem });
        if (secondOption) {
            const secondMenuItem = await this.getMenuItemInDatasetObjectDialog(secondOption);
            await secondMenuItem.waitForDisplayed({ timeout: 3000 });
            await browser.execute((el) => el.click(), secondMenuItem);
        }
        await this.waitForElementInvisible(this.getDatasetObjectContextMenu());
        await this.sleep(1000); // Wait for the data to refresh
    }

    async clickFormOrMetricContextMenuItem(text) {
        const menuItem = await this.getMenuItemElement(text);
        await menuItem.waitForClickable().catch(() => {
            throw new Error(`Menu item "${text}" is not clickable`);
        });
        if (await menuItem.isDisplayed()) {
            await menuItem.click();
        }
    }

    async isDataDisplayed(type, name) {
        return this.getElementByName(type, name).isDisplayed();
    }

    async clickCheckBoxInSearchResult(name) {
        return await this.getCheckBoxInSearchResult(name).click();
    }

    async isDatasetDisplayed(name) {
        return this.getDatasetContainerByName(name).isDisplayed();
    }

    async isDataContextMenuDisplayed() {
        return await this.getDataContextMenu().isDisplayed();
    }

    async getDatasetNameText(index = 0) {
        const datasetNameElement = await this.getDatasetName(index);
        return await datasetNameElement.getText();
    }

    async isSearchIconPresent() {
        return this.getSearchIcon().isDisplayed();
    }

    async isSearchPresent() {
        return this.getSearchContainer().isDisplayed();
    }

    async inputSearchText(text) {
        const inputBox = this.getSearchInput();
        await inputBox.setValue(text);
    }

    async inputDatasetName(text) {
        await this.waitForElementVisible(this.getDatasetNameInput());
        const inputBox = this.getDatasetNameInput();
        await inputBox.setValue(text);
    }

    async renameDataset(text) {
        await this.openMenu();
        await this.clickManipulateButtonDisplayed('Rename');
        await this.inputDatasetName(text);
    }

    async searchInReplaceDialog(text) {
        const inputBox = this.getSearchInReplaceDialog();
        await inputBox.setValue(text);
        await this.enter();
        await this.waitForElementVisible(this.getDatasetInSearchResult(text));
    }

    async hoverSearchBox() {
        await (await this.getSearchContainer()).moveTo();
    }

    async isClearSearchIconDisplayed() {
        await this.hoverSearchBox();
        return this.getClearSearchIcon().isDisplayed();
    }

    async clickDatasetArrow() {
        return this.click({ elem: this.getCollapseArrow() });
    }

    async clickFolderArrow(name) {
        return this.click({ elem: this.getFolderCollapseArrow(name) });
    }

    async isNoContentMessageDisplayed() {
        return this.getNoContentMessage().isDisplayed();
    }

    async isDescriptionDisabled(el) {
        const clsName = await getAttributeValue(el, 'className');
        return clsName.includes('mstr-ai-chatbot-EditableMarkdown-read-only');
    }

    async isDatasetDescriptionDisabled(datasetName) {
        const el = this.getDatasetDescription(datasetName);
        return this.isDescriptionDisabled(el);
    }

    async isObjectDescriptionDisabled(datasetName, objectName) {
        const el = this.getObjectDescription(datasetName, objectName);
        return this.isDescriptionDisabled(el);
    }

    async isBotDescriptionDisabled(botName) {
        const el = this.getBotDescription(botName);
        return this.isDescriptionDisabled(el);
    }

    async checkOrUncheckData(elem) {
        const checkboxElem = this.getSelectBox(elem);
        const checkBoxFolderElem = this.getSelectBoxInFolder(elem);
        if (await checkboxElem.isDisplayed()) {
            await this.click({ elem: checkboxElem });
        } else if (await checkBoxFolderElem.isDisplayed()) {
            await this.click({ elem: checkBoxFolderElem });
        } else {
            throw new Error(`Data ${elem} is not displayed`);
        }
    }

    async clickCheckboxOnDatasetTitle(name) {
        const datasetTitle = (await this.getDatasetTitle(name)).$('.mstr-ai-chatbot-Checkbox');
        await datasetTitle.click();
    }

    async isDataChecked(elem) {
        const status = await this.getSelectBotStatus(elem);

        //true if the status is 'true', false otherwise
        return status === 'true';
    }

    async isDataCheckedInFolder(elem) {
        if (this.getSelectBoxStatusInFolder(elem) === 'true') {
            return true;
        } else {
            return false;
        }
    }

    async waitForRefreshPageLoading() {
        await this.waitForElementVisible(this.getRefreshPage(AIBotDatasetPanel.TIMEOUT));
    }

    async clickOnDatasetInReplace(name) {
        if (await this.getDataSetInReplace(name).isDisplayed()) {
            return this.getDataSetInReplace(name).click();
        } else {
            throw new Error(`Dataset ${name} is not displayed`);
        }
    }

    async openMenu() {
        if (await this.getMenuButton().isDisplayed()) {
            return this.click({ elem: this.getMenuButton() });
        } else {
            throw new Error(`Button ${button} is not displayed`);
        }
    }

    async isMenuContainerDisplayed() {
        return this.getMenuContainer().isDisplayed();
    }

    async isDisplayedDatasetName(name) {
        return this.getDatasetNameText() === name;
    }

    async isDisplayReplacePage() {
        return (await this.getReplaceDialogHeader()).isDisplayed();
    }

    async waitForCoverSpinnerDismiss() {
        await this.waitForElementStaleness(this.getCoverSpinner(AIBotDatasetPanel.TIMEOUT));
    }

    async waitForReplacePageLoading() {
        await this.waitForElementStaleness(this.getReplaceLoadingIcon(AIBotDatasetPanel.TIMEOUT));
        await this.waitForElementVisible(this.getReplaceDialogHeader(AIBotDatasetPanel.TIMEOUT));
        await this.waitForElementStaleness(this.getReplaceSecondLoadingIcon(AIBotDatasetPanel.TIMEOUT));
        await this.waitForElementVisible(this.getModeSwitcher(AIBotDatasetPanel.TIMEOUT));
    }

    async clickReplacePageButton(button) {
        await this.waitForReplacePageLoading();
        if (await this.getReplacePageButton(button).isDisplayed()) {
            await this.getReplacePageButton(button).click();
        } else {
            throw new Error(`Button ${button} is not displayed`);
        }
        await this.waitForElementInvisible(this.getDataPanelContainer(AIBotDatasetPanel.TIMEOUT));
    }

    async clickMenuButtonForDataset(name) {
        const datasetContainer = await this.getDatasetContainerByName(name);
        if (await datasetContainer.isDisplayed()) {
            const menuButton = await this.getMenuButtonForDataset(datasetContainer);
            if (await menuButton.isDisplayed()) {
                return menuButton.click();
            } else {
                throw new Error(`Menu button for dataset ${name} is not displayed`);
            }
        } else {
            throw new Error(`Dataset ${name} is not displayed`);
        }
    }

    async openDataset(name) {
        const datasetContainer = await this.getDatasetContainerByName(name);
        const arrowButton = await this.getArrowButtonForDatasetContainer(datasetContainer);
        if ((await datasetContainer.getAttribute('data-state')) === 'closed') {
            if (await arrowButton.isDisplayed()) {
                await arrowButton.click();
            } else {
                throw new Error(`Arrow button for dataset ${name} is not displayed`);
            }
        }
    }

    async closeDataset(name) {
        const datasetContainer = await this.getDatasetContainerByName(name);
        const arrowButton = await this.getArrowButtonForDatasetContainer(datasetContainer);
        if ((await datasetContainer.getAttribute('data-state')) === 'open') {
            if (await arrowButton.isDisplayed()) {
                await arrowButton.click();
            } else {
                throw new Error(`Arrow button for dataset ${name} is not displayed`);
            }
        }
    }

    async waitForEditPageLoading() {
        await this.waitForElementVisible(this.getEditPage(AIBotDatasetPanel.TIMEOUT));
    }

    async waitForEditPageClose() {
        await this.waitForElementInvisible(this.getEditPage(AIBotDatasetPanel.TIMEOUT));
    }

    async clickButtonInEditPage() {
        const button = this.getAddButtonElement();
        await button.waitForDisplayed();
        await button.click();
    }

    async clickMojoPageButton(button) {
        if (await this.getMojoPageButton(button).isDisplayed()) {
            return this.getMojoPageButton(button).click();
        } else {
            throw new Error(`Button ${button} is not displayed`);
        }
    }

    async clickManipulateButtonDisplayed(button) {
        await this.openMenu();
        if (await this.getManipulateDatasetButton(button).isDisplayed()) {
            return this.getManipulateDatasetButton(button).click();
        } else {
            throw new Error(`Button ${button} is not displayed`);
        }
    }

    async clickOneDatasetManipuButton(dataset, button) {
        await this.clickMenuButtonForDataset(dataset);
        return this.getManipulateDatasetButton(button).click();
    }

    async hideDatasetList() {
        return this.hideElement(this.getDatasetList());
    }

    async waitForSearchContainerDisplayed() {
        await this.waitForElementDisplayed(this.getSearchInReplaceDialogContainer(AIBotDatasetPanel.TIMEOUT));
    }

    async waitForRefreshLoading() {
        await this.waitForElementVisible(this.getRefreshDoneIcon(AIBotDatasetPanel.TIMEOUT));
    }

    async isErrorIconDisplayed() {
        return this.getErrorIcon().isDisplayed();
    }

    async isPanelErrorIconDisplayed() {
        return this.getPanelErrorIcon().isDisplayed();
    }

    async waitForNewDIPageLoading() {
        await this.waitForElementVisible(this.getNewDIPage(AIBotDatasetPanel.TIMEOUT));
        await this.waitForElementVisible(this.getNewDIPageSearch(AIBotDatasetPanel.TIMEOUT));
    }

    async chooseDataType(text) {
        await this.waitForNewDIPageLoading();
        await this.click({ elem: this.getNewDIPageSearch() });
        await this.input(text);
        await this.enter();
        await this.click({ elem: this.getImportDataType(text) });
    }

    async renameErrorMessage() {
        await this.waitForElementVisible(this.getRenameError());
        const errorMessageElement = await this.getRenameError();
        return await errorMessageElement.getText();
    }

    async setName(value) {
        const inputElement = await this.getDatasetNameInput();
        await this.delete();
        for (let character of value.split('')) {
            await this.input(character);
            await inputElement.click();
        }
        await this.enter();
    }

    async clickOnDatasetInSearch(name) {
        if (await this.getDatasetInSearchResult(name).isDisplayed()) {
            return this.getDatasetInSearchResult(name).click();
        } else {
            throw new Error(`Dataset ${name} is not displayed`);
        }
    }

    async clickOnDatasetTitle(index = 0) {
        if (await this.getDatasetPanelDatasetTitle(index).isDisplayed()) {
            return this.getDatasetPanelDatasetTitle(index).click();
        }
        throw new Error(`Dataset title is not displayed`);
    }

    async waitForDataPanelContainerLoading() {
        await this.waitForElementVisible(this.getDataPanelContainer());
    }

    async tooltipText() {
        const element = await this.getErrorIcon();
        return await element.getAttribute('aria-label');
    }

    async panelTooltipText() {
        const element = await this.getPanelErrorIcon();
        return await element.getAttribute('aria-label');
    }

    async hoverErrorIcon() {
        if (await this.getErrorIcon().isDisplayed()) {
            return this.getErrorIcon().moveTo();
        } else {
            throw new Error(`Error icon is not displayed`);
        }
    }

    async isWarningForDatasetDisplayed(name) {
        const datasetContainer = await this.getDatasetContainerByName(name);
        return this.getWaringIconForDataset(datasetContainer).isDisplayed();
    }

    async isWarningForBotDisplayed(name) {
        const botContainer = await this.getBotContainerByName(name);
        return this.getWarningIconForBot(botContainer).isDisplayed();
    }

    async hoverErrorIconForDataset(name) {
        const datasetContainer = await this.getDatasetContainerByName(name);
        if (await this.getWaringIconForDataset(datasetContainer).isDisplayed()) {
            return this.getWaringIconForDataset(datasetContainer).moveTo();
        } else {
            throw new Error(`Error icon is not displayed`);
        }
    }

    async tooltipTextForDataset(name) {
        const datasetContainer = await this.getDatasetContainerByName(name);
        const element = await this.getWaringIconForDataset(datasetContainer);
        return await element.getAttribute('aria-label');
    }

    async hoverPanelErrorIcon() {
        if (await this.getPanelErrorIcon().isDisplayed()) {
            return this.getPanelErrorIcon().moveTo();
        } else {
            throw new Error(`Error icon is not displayed`);
        }
    }

    async checkAllInRefresh() {
        await this.waitForRefreshPageLoading();
        if (await this.getSelectAllInRefresh().isDisplayed()) {
            return this.getSelectAllInRefresh().click();
        } else {
            throw new Error(`checkbox of Select All is not displayed`);
        }
    }

    async chooseFileInNewDI(text, title = newDIUILabels.English.dataSourceTitle) {
        await this.waitForFileSamplePageLoading(title);
        await this.waitForElementVisible(this.getSampleFileContentContainer());
        await this.click({ elem: this.getChooseFile(text) });
    }

    async waitForFileSamplePageLoading(title = newDIUILabels.English.dataSourceTitle) {
        await this.waitForElementVisible(this.getFileSamplePage(title));
    }

    async waitForTextAppearInDataSetPanel(text) {
        await this.waitForElementVisible(this.getDataPanelContainer());
        await this.waitForTextAppearInElement(this.getDataPanelContainer(), text, AIBotDatasetPanel.TIMEOUT);
    }

    async isFileSamplePageDisplayed() {
        return this.getFileSamplePage().isDisplayed();
    }

    async waitForLoaded() {
        await browser.waitUntil(
            async () => {
                const readyState = await browser.execute(() => {
                    return document.readyState;
                });
                return readyState === 'complete';
            },
            5000,
            'expected page to be loaded after 5s'
        );
    }

    async waitForNewDIClose() {
        await this.waitForElementInvisible(this.getNewDIPage(AIBotDatasetPanel.TIMEOUT));
    }

    async clickMenuItemInEdit(text) {
        const menuItemElement = this.getMenuItemElement(text);
        await menuItemElement.waitForClickable();
        await menuItemElement.click();
        await this.getDataRenameInput().waitForDisplayed();
    }

    async hoverMenuItem(text) {
        const menuItemElement = this.getMenuItemElement(text);
        await menuItemElement.moveTo();
    }

    async waitForUploadFilePageLoading() {
        await this.waitForElementVisible(this.getUploadFilePage(AIBotDatasetPanel.TIMEOUT));
    }

    async hoverTable(text) {
        const tableElement = this.getChooseTableInNewDI(text);
        await tableElement.moveTo();
    }

    async manipulateTable(elem) {
        const itemElement = this.getDeleteTableButton(elem);
        await this.waitForElementVisible(itemElement, AIBotDatasetPanel.TIMEOUT);
        await itemElement.moveTo();
        await itemElement.click();
    }

    async clickDataSortBy(text) {
        const itemElement = this.getDataSortBy(text);
        await this.waitForElementVisible(itemElement, AIBotDatasetPanel.TIMEOUT);
        await itemElement.click();
    }

    async switchToAdvancedMode() {
        await this.click({ elem: this.getAdvancedModeButton() });
        await this.waitForItemLoading();
    }

    async isAdvancedButtonDisplayed() {
        return (await this.getAdvancedModeButton()).isDisplayed();
    }

    async isAdvancedButtonEnabled() {
        return (await this.getAdvancedModeButton()).isEnabled();
    }

    async getDatasetName(index = 0) {
        await browser.waitUntil(
            async () => (await this.$$('.mstr-ai-chatbot-Datasets-dataset-title-label')).length > 0,
            {
                timeout: 5000,
                timeoutMsg: 'Expected dataset to be present within 5s',
            }
        );
        const datasets = await this.$$('.mstr-ai-chatbot-Datasets-dataset-title-label');
        console.log(`Number of datasets found: ${datasets.length}`);
        if (index < datasets.length) {
            return datasets[index];
        } else {
            throw new Error(`Dataset index ${index} is not displayed`);
        }
    }

    async hoverOnDatasetName(index = 0) {
        const dataset = await this.getDatasetName(index);
        await dataset.moveTo();
    }

    async isLinkIconDisplayed() {
        return this.getLinkIcon().isDisplayed();
    }

    async isLinkIconDisplayedOfObject(dataset, object) {
        return this.getDatasetObject(dataset, object).isDisplayed();
    }

    async hoverOnDataName(data) {
        const dataName = await this.getDataName(data);
        await dataName.moveTo();
    }

    async rightClickOnDataName(data) {
        const dataName = await this.getDataName(data);
        await dataName.click({ button: 'right' });
    }

    async rightClickOnObjectFromDataset(dataset, object) {
        const dataName = await this.getObjectNameFromDataset(dataset, object);
        await dataName.waitForClickable().catch(() => {
            throw new Error(`Object ${object}@${dataset} is not clickable`);
        });
        await dataName.click({ button: 'right' });
    }

    async renameData(data, text) {
        await this.rightClickOnDataName(data);
        await this.clickMenuItemInEdit('Rename');
        // const dataName = await this.getDataName(data);
        // await dataName.doubleClick();
        const inputBox = this.getDataRenameInput();
        await this.input(text);
        await inputBox.click();
        await this.enter();
    }

    async clickDatasetTypeInDatasetPanel(datasetType) {
        await this.getMenuItemInDatasetDialog(datasetType).click();
    }

    async clickOkBtnInAttributeForms() {
        const btn = await this.getOKButtonInAttributeForms();
        await btn.waitForClickable({ timeout: 5000 });
        await browser.execute(async (el) => {
            await el.click();
        }, btn);
    }

    async checkOrUncheckAttributeForms(form) {
        const checkbox = await this.getAttributeFormCheckboxByFormName(form);
        await checkbox.waitForClickable({ timeout: 5000 });
        await browser.execute(async (el) => {
            await el.click();
        }, checkbox);
    }

    async clickAdvancedButton() {
        await this.click({ elem: this.getAdvancedContainer() });
    }

    async searchDataset(searchText) {
        const searchBox = await this.getSearchBox();
        await searchBox.setValue(searchText);
        await this.enter();
    }

    async toggleShowDescription() {
        await this.click({ elem: this.getShowDescriptionToggle() });
    }

    async getShowDescriptionState() {
        const toggle = await this.getShowDescriptionToggle();
        return toggle.getAttribute('aria-checked');
    }

    async hasDescriptionVisible() {
        const description = this.$('.mstr-ai-chatbot-EditableMarkdown.mstr-ai-chatbot-Datasets-description');
        return (await description?.isDisplayed()) === true;
    }

    async isDescriptionVisible(datasetName, objectName) {
        const description = await this.getObjectDescription(datasetName, objectName);
        return description.isDisplayed();
    }

    async openDatasetSelector() {
        await this.getDatasetSelector().click();
    }

    async selectDatasetFromDropdown(datasetName) {
        await this.openDatasetSelector();
        const option = await this.getDatasetOption(datasetName);
        await option.click();
    }

    async getSelectedDatasetText() {
        const selectorText = await this.getDatasetSelectorText();
        return selectorText.getText();
    }

    async enableShowDescription() {
        const toggle = await this.getShowDescriptionToggle();
        if ((await toggle.getAttribute('aria-checked')) === 'false') {
            await this.toggleShowDescription();
        }
    }

    async disableShowDescription() {
        const toggle = await this.getShowDescriptionToggle();
        if ((await toggle.getAttribute('aria-checked')) === 'true') {
            await this.toggleShowDescription();
        }
    }

    async getDescriptionText(datasetName, objectName) {
        if (objectName) {
            return this.getObjectDescription(datasetName, objectName).getText();
        } else {
            return this.getDatasetDescription(datasetName).getText();
        }
    }

    async getBotDescriptionText(botName) {
        return this.getBotDescription(botName).getText();
    }

    async isDatasetOptionDisplayed(datasetName) {
        const option = await this.getDatasetOption(datasetName);
        return option.isDisplayed();
    }

    async clickUpdateDatasetButton({ isWaitLoading = true } = {}) {
        await this.click({ elem: this.getUpdateDatasetButton() });
        if (isWaitLoading) {
            await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
            await this.waitForCurtainDisappear();
            return this.sleep(1000);
        }
    }

    async getAllDatasetObjects() {
        return this.$$('.mstr-ai-chatbot-Datasets-dataset-mainview .mstr-ai-chatbot-DatasetObject-object-name span');
    }

    async isDatasetObjectSelected(objectName) {
        const checkboxButton = await this.getCheckboxByDatasetObjectName(objectName);
        return (await checkboxButton.getAttribute('aria-checked')) === 'true';
    }

    async toggleCheckboxForDatasetObject(objectName) {
        const checkboxButton = await this.getCheckboxByDatasetObjectName(objectName);
        await this.click({ elem: checkboxButton });
    }

    async hideDatasetObject(objectName) {
        if (await this.isDatasetObjectSelected(objectName)) {
            await this.toggleCheckboxForDatasetObject(objectName);
        }
    }

    async toggleNerSwitchForDatasetObject(objectName) {
        const nerSwitch = await this.getNerSwitchByDatasetObjectName(objectName);
        await this.click({ elem: nerSwitch });
    }

    async hasObjectDescription(objectName) {
        const description = await this.getObjectDescription(objectName);
        return description.isExisting();
    }

    async updateDatasetDescription(datasetName, newDescription) {
        const description = await this.getDatasetDescription(datasetName);
        await description.scrollIntoView();
        await this.click({ elem: description });
        const textArea = await this.getDatasetDescriptionTextArea(datasetName);
        for (let i = 0; i < 5; i++) {
            const disabled = await this.isDatasetDescriptionDisabled(datasetName);
            if (!disabled) {
                console.log(`try to delete :`, i);
                await this.ctrlA();
                await this.sleep(200);
                await this.delete();
                await this.sleep(300);
            } else break;
        }
        await textArea.setValue(newDescription);
        await this.dismissFocus();
        return this.sleep(500);
    }

    async updateObjectDescription(datasetName, objectName, newDescription) {
        const description = await this.getObjectDescription(datasetName, objectName);
        await description.scrollIntoView();
        await this.click({ elem: description });
        const textArea = await this.getObjectDescriptionTextArea(datasetName, objectName);
        for (let i = 0; i < 5; i++) {
            const disabled = await this.isObjectDescriptionDisabled(datasetName, objectName);
            if (!disabled) {
                console.log(`try to delete :`, i);
                await this.ctrlA();
                await this.sleep(200);
                await this.delete();
                await this.sleep(300);
            } else break;
        }
        await textArea.setValue(newDescription);
        await this.dismissFocus();
        return this.sleep(500);
    }

    async updateBotDescription(botName, newDescription) {
        const description = await this.getBotDescription(botName);
        await description.scrollIntoView();
        await this.click({ elem: description });
        const textArea = await this.getBotDescriptionTextArea(botName);
        for (let i = 0; i < 5; i++) {
            const disabled = await this.isBotDescriptionDisabled(botName);
            if (!disabled) {
                console.log(`try to delete :`, i);
                await this.ctrlA();
                await this.sleep(200);
                await this.delete();
                await this.sleep(300);
            } else break;
        }
        await textArea.setValue(newDescription);
        await this.dismissFocus();
        return this.sleep(500);
    }

    async waitForNerSwitchSpinnerAppear(objectName) {
        await this.waitForElementVisible(this.getNerSwitchSpinnerByDatasetObjectName(objectName));
    }

    async waitForNerCurtainDisappear(datasetName, objectName) {
        await this.waitForElementInvisible(this.getNerCurtainByDatasetObjectName(datasetName, objectName));
    }

    async waitForNerSwitchSpinnerDisappear(objectName) {
        await this.waitForElementInvisible(this.getNerSwitchSpinnerByDatasetObjectName(objectName));
    }

    async clickNewBotButton() {
        await this.click({ elem: this.getAddNewBotButton() });
        return this.libraryAuthoringPage.waitForProjectSelectionWindowAppear();
    }

    async inputBotAlias(botName, aliasName) {
        const el = await this.getBotAliasInputbot(botName);
        await this.clear({ elem: el });
        await el.setValue(aliasName);
    }

    async updateBotAlias(botName, aliasName) {
        await this.inputBotAlias(botName, aliasName);
        await this.enter();
    }

    async addBotAlias(botName, aliasName) {
        if (!(await this.getBotAliasInputbot(botName).isDisplayed())) {
            await this.openDatasetContextMenuV2(botName, true);
            await this.clickDatasetContextMenuItem('Manage Alias');
        }
        await this.updateBotAlias(botName, aliasName);
        await this.waitForElementVisible(this.getBotAliasPreview(botName));
    }

    async deleteBotAlias(botName) {
        if (!(await this.getBotAliasInputbot(botName).isDisplayed())) {
            await this.click({ elem: this.getBotAliasPreview(botName) });
        }
        await this.updateBotAlias(botName, '');
        await this.waitForElementInvisible(this.getBotAliasPreview(botName));
    }

    async editBotAlias(botName, aliasName) {
        if (!(await this.getBotAliasInputbot(botName).isDisplayed())) {
            await this.click({ elem: this.getBotAliasPreview(botName) });
        }
        await this.updateBotAlias(botName, aliasName);
        await this.waitForElementVisible(this.getBotAliasPreview(botName));
    }

    // Assertions helper
    async getDatasetObjectCount() {
        return this.getAllDatasetObjects().length;
    }

    async isDatasetElementDisplayed(data) {
        const el = await this.getDataContainName(data);
        return el && el.length > 0;
    }

    async getSubBotCount() {
        return this.getBotContainers().length;
    }

    async isDatasetMenuItemDisplayed(text) {
        const el = this.getDatasetMenuItem(text);
        return el.isDisplayed();
    }

    async isBotAliasWarningDisplayed() {
        return this.getBotAliasWarning().isDisplayed();
    }

    async getBotAliasWarningText() {
        return this.getBotAliasWarning().getText();
    }

    async getBotAliasPreviewText(botName) {
        return this.getBotAliasPreview(botName).getText();
    }

    async closeDatasetWarningDialog() {
        return this.click({ elem: this.getCloseBtnInWarningDialog() });
    }

    async isNerSwitchChecked(objectName) {
        const nerSwitch = await this.getNerSwitchByDatasetObjectName(objectName);
        const switchButton = await nerSwitch.$(`button`);
        await this.waitForElementVisible(switchButton);
        const dataState = await switchButton.getAttribute('data-state');
        return dataState == 'checked';
    }

    async isNerEnabledForObject(datasetName, objectName) {
        const nerMark = await this.getNerEnabledMark(datasetName, objectName).isDisplayed();
        const nerWarning = await this.getNerWarningMark(datasetName, objectName).isDisplayed();
        console.log(`nerMark: ${nerMark}, nerWarning: ${nerWarning}`);
        return nerMark && !nerWarning;
    }

    async createColumnAlias(datasetName, objectName, aliasName) {
        const obj = await this.getDatasetObject(datasetName, objectName);
        await this.openDatasetObjectContextMenuV2(datasetName, objectName);
        await this.clickDatasetObjectContextMenu('Manage Alias');
        const aliasInput = this.getAliasInput();
        await aliasInput.setValue(aliasName);
        await this.click({ elem: obj }); // Click outside to apply the alias
    }

    async isColumnAliasDisabled(datasetName, objectName) {
        const aliasComponent = await this.getObjectAliasComponent(datasetName, objectName);
        const classValue = await aliasComponent.getAttribute('class');
        return classValue.includes('mstr-ai-chatbot-ColumnAliasComponent--hidden');
    }
    async enableInputByClickAlias(dataName, objectName) {
        const aliasComponent = await this.getObjectAliasComponent(dataName, objectName);
        await aliasComponent.scrollIntoView();
        await this.click({ elem: aliasComponent });
        const aliasInput = this.getAliasInput();
        await aliasInput.waitForDisplayed();
    }

    async addColumnAliasInInput(aliasName) {
        const aliasInput = await this.getAliasInput();
        await aliasInput.setValue(aliasName);
        await this.enter(); // Press Enter to add the alias
        await this.waitForElementVisible(this.getAliasTagByNameInInput(aliasName));
    }

    async deleteColumnAliasInInput(aliasName) {
        const deleteButton = await this.getAliasTagDeleteButtonInInput(aliasName);
        await this.click({ elem: deleteButton });
        await this.waitForElementInvisible(this.getAliasTagByNameInInput(aliasName));
    }
    async deleteColumnAlias(datasetName, objectName, aliasName) {
        await scrollIntoView(await this.getDatasetObject(datasetName, objectName));
        const aliasTag = await this.getAliasTagByName(datasetName, objectName, aliasName);
        await this.hoverMouseOnElement(aliasTag);
        const deleteButton = await this.getAliasTagDeleteButton(datasetName, objectName, aliasName);
        await this.click({ elem: deleteButton });
        await this.waitForElementInvisible(await this.getAliasTagByName(datasetName, objectName, aliasName));
    }

    async isColumnAliasDisplayed(datasetName, objectName, aliasName) {
        const aliasTag = await this.getAliasTagByName(datasetName, objectName, aliasName);
        return aliasTag.isDisplayed();
    }
}
