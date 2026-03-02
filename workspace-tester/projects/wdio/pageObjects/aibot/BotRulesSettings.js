import BaseBotConfigTab from '../base/BaseBotConfigTab.js';

export default class BotRulesSettings extends BaseBotConfigTab {
    constructor() {
        super();
    }
    // Element locator
    getManageRulesTitle() {
        return this.$('.mstr-ai-chatbot-RulesPanel-title');
    }

    getAddRuleButton() {
        return this.$('.mstr-ai-chatbot-RulesPanel-add-button');
    }

    getRulesList() {
        return this.$('.mstr-ai-chatbot-RulesPanel-rules-list');
    }

    getRuleItemContainerByIndex(index) {
        return this.$$('.mstr-ai-chatbot-RuleItem-container')[index];
    }

    getCountOfRuleItems() {
        return this.$$('.mstr-ai-chatbot-RuleItem-container').length;
    }

    getRuleNameInput(index) {
        return this.getRuleItemContainerByIndex(index).$('.mstr-ai-chatbot-RuleItem-name-input');
    }

    getBasedOnList(index) {
        return this.getRuleItemContainerByIndex(index).$('.mstr-ai-chatbot-RuleItem-based-on-list');
    }

    getBasedOnDropdownSelector(index) {
        return this.getRuleItemContainerByIndex(index).$('.ant-select-selection-overflow');
    }

    getBasedOnSearchInput(index) {
        return this.getRuleItemContainerByIndex(index).$('.ant-select-selection-search-input');
    }

    getBasedOnAllObjectLabel(index) {
        return this.getRuleItemContainerByIndex(index).$('.mstr-ai-chatbot-RuleItem-based-on-all-label');
    }

    getDeleteBtnForBasedOnAllObjectLabel(index) {
        return this.getBasedOnAllObjectLabel(index).$('div[role="button"][aria-label="Delete"]');
    }

    getRecentlyEditedLabel(index) {
        return this.getRuleItemContainerByIndex(index).$('.mstr-ai-chatbot-RuleItem-recent-edit-label');
    }

    getBasedOnSelectCount(index) {
        return this.getRuleItemContainerByIndex(index).$('.mstr-ai-chatbot-RuleItem-section-based-on-header-count').getText();
    }

    // dropdown helpers
    getSearchInputForDropdown() {
        return this.$('.ant-select-selection-search-input.focus-visible');
    }

    getDropdown() {
        return this.$('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    }
    
    getDropdownOption(objectName) {
        // Find dropdown option by the span text content inside the option
        return this.getDropdown().$(`.//div[@role="option"]//*[text()="${objectName}"]`);
    }

    getDropdownOptionEditIcon(objectName) {
        return this.getDropdown().$(`.//div[@role="option"]//*[text()="${objectName}"]/ancestor::div[contains(@class,"mstr-ai-chatbot-DatasetObjectPicker-option")]//div[contains(@class,"mstr-ai-chatbot-DatasetObjectPicker-edit-button")]`);
    }

    getDropdownEmptyMessage() {
        // Check if no search results found
        return this.getDropdown().$('.ant-select-item-empty');
    }

    getBasedOnObject(ruleIndex, objectName) {
        return this.getRuleItemContainerByIndex(ruleIndex).$(`//span[@class="mstr-ai-chatbot-BasedOnItem-based-on-object-name" and text()="${objectName}"]`);
    }

    getDeleteButtonForBasedOnObject(ruleIndex, objectName) {
        const basedOnObject = this.getBasedOnObject(ruleIndex, objectName);
        return basedOnObject.$('..//div[contains(@class, "mstr-ai-chatbot-BasedOnItem-based-on-delete-button")]');
    }

    getBasedOnObjectCollapseButton(ruleIndex, objectName) {
        const basedOnObject = this.getBasedOnObject(ruleIndex, objectName);
        return basedOnObject.$('../../div[contains(@class,"mstr-ai-chatbot-Collapsible-arrow")]');
    }

    getBasedOnConfigurationSection(ruleIndex, objectName) {
        const basedOnObject = this.getBasedOnObject(ruleIndex, objectName);
        return basedOnObject.$('../../following-sibling::div[contains(@class,"mstr-ai-chatbot-Collapsible-content")]');
    }

    getBasedOnConfigurationActionDropdownTrigger(ruleIndex, basedOnObject) {
        const metricContainer = this.getBasedOnConfigurationSection(ruleIndex, basedOnObject);
        return metricContainer.$('.mstr-ai-chatbot-Select-selectTrigger');
    }

    getBasedOnConfigurationObjectDropdownTrigger(ruleIndex, basedOnObject) {
        return this.getBasedOnConfigurationSection(ruleIndex, basedOnObject).$('.ant-select-multiple');
    }

    getBasedOnConfigurationAddButton(ruleIndex, basedOnObject) {
        const metricContainer = this.getBasedOnConfigurationSection(ruleIndex, basedOnObject);
        return metricContainer.$('div[role="button"][aria-label="Add"]');
    }

    getBasedOnConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex) {
        return this.getBasedOnConfigurationSection(ruleIndex, basedOnObject).$$('.mstr-ai-chatbot-BasedOnConfig')[configIndex];
    }

    getBasedOnConfigurationItemButton(ruleIndex, basedOnObject, configIndex, btnLabel) {
        return this.getBasedOnConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex).$(`div[role="button"][aria-label="${btnLabel}"]`);
    }

    getDeleteRuleButton(index) {
        return this.getRuleItemContainerByIndex(index).$('.mstr-ai-chatbot-RuleItem-delete-button');
    }

    getWhenInput() {
        return this.$('//input[contains(@class,"when-input")]');
    }

    // FILTERS, Order By, Group By
    getAddButtonByLabel(index, label) {
        return this.getRuleItemContainerByIndex(index).$(`//*[text()="${label}"]/following-sibling::div[@role="button" and @aria-label="Add"]`);
    }

    getFilterList(ruleIndex) {
        return this.getRuleItemContainerByIndex(ruleIndex).$('.mstr-ai-chatbot-RuleItem-config-item-list');
    }

    getFilterItemCount(ruleIndex) {
        return this.getFilterList(ruleIndex).$$('.mstr-ai-chatbot-SqlTemplateGeneralItem-preview-container').length;
    }

    getFilterItemContainerByIndex(ruleIndex, filterIndex) {
        return this.getFilterList(ruleIndex).$$('.mstr-ai-chatbot-SqlTemplateGeneralItem-preview-container')[filterIndex];
    }

    getFilterItemButton(ruleIndex, filterIndex, btnLabel) {
        return this.getFilterItemContainerByIndex(ruleIndex, filterIndex).$(`div[role="button"][aria-label="${btnLabel}"]`);
    }

    getFilterWhenInput() {
        return this.$('.mstr-ai-chatbot-FilterItem-when-input');
    }

    getFilterDropdownTrigger() {
        return this.$('.mstr-ai-chatbot-DatasetObjectPicker');
    }

    getFilterOperatorDropdownTrigger() {
        return this.$('.mstr-ai-chatbot-FilterItem-operator-select');
    }

    getFilterValueInput() {
        return this.$('.mstr-ai-chatbot-FilterItem-element-input');
    }

    getOrderByList(ruleIndex) {
        return this.getRuleItemContainerByIndex(ruleIndex).$$('.mstr-ai-chatbot-SqlTemplateRuleComponent')[0];
    }

    getOrderByItemCount(ruleIndex) {
        return this.getOrderByList(ruleIndex).$$('.mstr-ai-chatbot-DraggableRuleItem').length;
    }

    getGroupByList(ruleIndex) {
        return this.getRuleItemContainerByIndex(ruleIndex).$$('.mstr-ai-chatbot-SqlTemplateRuleComponent')[1];
    }

    getGroupByItemCount(ruleIndex) {
        return this.getGroupByList(ruleIndex).$$('.mstr-ai-chatbot-DraggableRuleItem').length;
    }

    getDraggableRuleWhenInput() {
        return this.$('.mstr-ai-chatbot-DraggableRuleItem-when-input');
    }

    getDraggableRuleEditingContainer() {
        return this.$('.mstr-ai-chatbot-DraggableRuleItem-editing-container');
    }

    getOrderBySortButton() {
        return this.$('div[role="button"][aria-label="Sort"]');
    }

    getOrderByGroupByDropdownTrigger() {
        return this.getDraggableRuleEditingContainer().$('.mstr-ai-chatbot-Select-selectTrigger');
    }

    getOrderByItemByIndex(ruleIndex, orderByIndex) {
        return this.getOrderByList(ruleIndex).$$('.mstr-ai-chatbot-DraggableRuleItem')[orderByIndex];
    }

    getGroupByItemByIndex(ruleIndex, groupByIndex) {
        return this.getGroupByList(ruleIndex).$$('.mstr-ai-chatbot-DraggableRuleItem')[groupByIndex];
    }

    getOrderByItemEditButton(ruleIndex, orderByIndex) {
        return this.getOrderByItemByIndex(ruleIndex, orderByIndex).$('div[role="button"][aria-label="Edit"]');
    }

    getOrderByItemDeleteButton(ruleIndex, orderByIndex) {
        return this.getOrderByItemByIndex(ruleIndex, orderByIndex).$('div[role="button"][aria-label="Delete"]');
    }

    getGroupByItemEditButton(ruleIndex, groupByIndex) {
        return this.getGroupByItemByIndex(ruleIndex, groupByIndex).$('div[role="button"][aria-label="Edit"]');
    }

    getGroupByItemDeleteButton(ruleIndex, groupByIndex) {
        return this.getGroupByItemByIndex(ruleIndex, groupByIndex).$('div[role="button"][aria-label="Delete"]');
    }

    // Advanced Settings
    getAdvancedSettingsRuleContainer(ruleIndex) {
        return this.getRuleItemContainerByIndex(ruleIndex).$('.mstr-ai-chatbot-RuleItem-adv-settings-collapsible');
    }

    getAdvancedSettingsToggleButton(ruleIndex) {
        return this.getAdvancedSettingsRuleContainer(ruleIndex).$('button[data-feature-id="aibot-edit-rules-config-advanced-settings-toggle"]');
    }

    getAdvancedSettingsContent(ruleIndex) {
        return this.getAdvancedSettingsRuleContainer(ruleIndex).$('.mstr-ai-chatbot-Collapsible-content');
    }

    getGeneralItemEditingContainer() {
        return this.$('.mstr-ai-chatbot-SqlTemplateGeneralItem-editing-container');
    }

    // for preferences, there are 3 dropdowns appear at the same time. for normal case, the dropdown index is 0
    getDropdownTriggerInAdvancedSettings(dropdownIndex) {
        return this.getGeneralItemEditingContainer().$$('.mstr-ai-chatbot-Select-selectTrigger--search')[dropdownIndex];
    }

    getValueInputInAdvancedSettings() {
        return this.getGeneralItemEditingContainer().$('input[data-feature-id="aibot-edit-rules-config-element-input-v2"]');
    }

    getPreferenceRadiosInAdvancedSettings() {
        return this.getGeneralItemEditingContainer().$$('input[type="radio"][data-feature-id="aibot-edit-rules-config-radio-toggle-v2"]');
    }

    getAdvancedSettingsRuleItem(ruleIndex, sectionIndex, itemIndex) {
        return this.getAdvancedSettingsRuleContainer(ruleIndex).$$('.mstr-ai-chatbot-RuleItem-section')[sectionIndex].$$('.mstr-ai-chatbot-SqlTemplateGeneralItem-preview-container')[itemIndex];
    }

    getAdvancedSettingsRuleItemButton(ruleIndex, sectionIndex, itemIndex, btnLabel) {
        return this.getAdvancedSettingsRuleItem(ruleIndex, sectionIndex, itemIndex).$(`div[role="button"][aria-label="${btnLabel}"]`);
    }

    // Action helper
    async clickManageRulesTitleToExitEdit() {
        await this.click({ elem: this.getManageRulesTitle() });
    }

    async addNewRule() {
        const index = await this.getCountOfRuleItems();
        await this.click({ elem: this.getAddRuleButton() });
        await this.waitForElementVisible(this.getRuleItemContainerByIndex(index));
    }

    async deleteRuleByIndex(index) {
        await this.click({ elem: this.getDeleteRuleButton(index) });
    }

    async renameRuleByIndex(index, newName) {
        const nameInput = await this.getRuleNameInput(index);
        await this.click({ elem: nameInput });
        await nameInput.setValue(newName);
    }

    // Action - Based On

    async addBasedOnObjectsBySelection(ruleIndex, objectNames) {
        const objectNamesArray = Array.isArray(objectNames) ? objectNames : [objectNames];
        
        // Click on the dropdown to open it
        await this.click({ elem: this.getBasedOnList(ruleIndex) });

        // Wait for dropdown to open
        await this.waitForElementVisible(this.getDropdown());
        
        for (const objectName of objectNamesArray) {
            // Use the most reliable method to find option by text
            let option = await this.getDropdownOption(objectName);
            await this.click({ elem: option });
            console.log(`Selected object: ${objectName}`);
            await this.sleep(300); // Brief pause between selections
            }
            
        // Close dropdown by clicking the dropdown selector
        const dropdown = await this.getDropdown();
        if (await dropdown.isExisting()) {
            await this.click({ elem: this.getBasedOnDropdownSelector(ruleIndex) });
            await this.waitForElementInvisible(dropdown);
        }
    }

    async inputTermForSearchDropdown(term) {
        const searchInput = await this.getSearchInputForDropdown();
        await searchInput.setValue(term);
        await this.sleep(500); // Wait for search results to load
    }

    async clearSearchInputInDropdown() {
        const searchInput = await this.getSearchInputForDropdown();
        await searchInput.clearValue();
    }

    async openBasedOnDropdown(ruleIndex) {
        const dropdown = await this.getDropdown();
        if (!(await dropdown.isExisting())) {
            await this.click({ elem: this.getBasedOnList(ruleIndex) });
        }
        await this.waitForElementVisible(dropdown);
    }

    async closeBasedOnDropdown(ruleIndex) {
        const dropdown = await this.getDropdown();
        if (await dropdown.isExisting()) {
            await this.click({ elem: this.getBasedOnDropdownSelector(ruleIndex) });
            await this.waitForElementInvisible(dropdown);
        }
    }

    async addBasedOnObjectsBySearch(ruleIndex, objectNames) {
        const objectNamesArray = Array.isArray(objectNames) ? objectNames : [objectNames];
        // Click on the dropdown to open it
        await this.click({ elem: this.getBasedOnList(ruleIndex) });   
        await this.waitForElementVisible(this.getDropdown());

        for (const objectName of objectNamesArray) {
            // Use the most reliable method to find option by text
            await this.inputTermForSearchDropdown(objectName);
            
            // Check if search returned no results
            const emptyMessage = await this.getDropdownEmptyMessage();
            if (await emptyMessage.isExisting()) {
                console.warn(`No search results found for "${objectName}"`);
                await this.clearSearchInputInDropdown();
                continue; // Skip to next object
            }
            
            let option = await this.getDropdownOption(objectName);
            if (!(await option.isExisting())) {
                console.warn(`Option "${objectName}" not found even after search`);
                await this.clearSearchInputInDropdown();
                continue; // Skip to next object
            }            
            await this.click({ elem: option });
            console.log(`Selected object: ${objectName}`);
            await this.sleep(300); // Brief pause between selections
        }
        
        // Close dropdown by clicking the dropdown selector
        const dropdown = await this.getDropdown();
        if (await dropdown.isExisting()) {
            await this.click({ elem: this.getBasedOnDropdownSelector(ruleIndex) });
            await this.waitForElementInvisible(dropdown);
        }
    }

    async addBasedOnObjectsSelectingAll(ruleIndex) {
        await this.click({ elem: this.getBasedOnList(ruleIndex) });
        await this.waitForElementVisible(this.getDropdown());

        const selectAllOption = await this.getDropdownOption('Select All Objects');
        await this.click({ elem: selectAllOption });
    }

    async addRecentlyEditedObjectsWithAllObjectsSelected(ruleIndex, objectNames) {
        const objectNamesArray = Array.isArray(objectNames) ? objectNames : [objectNames];
        // Click on the dropdown to open it
        await this.click({ elem: this.getBasedOnList(ruleIndex) });
        const dropdown = await this.getDropdown();   
        await this.waitForElementVisible(dropdown);

        for (const objectName of objectNamesArray) {
            await this.inputTermForSearchDropdown(objectName);
            const option = await this.getDropdownOption(objectName);
            if (!(await option.isExisting())) {
                console.warn(`Option "${objectName}" not found even after search`);
                await this.clearSearchInputInDropdown(); // Clear search input
                continue; // Skip to next object
            }
            await this.hover({ elem: option });
            console.log(`Edit icon shows for item: ${objectName}`);
            const editIcon = await this.getDropdownOptionEditIcon(objectName);
            await this.click({ elem: editIcon });
            await this.waitForElementVisible(this.getBasedOnObject(ruleIndex, objectName));
        }
        // close dropdown by clicking the dropdown selector
        if (await dropdown.isExisting()) {
            await this.click({ elem: this.getBasedOnDropdownSelector(ruleIndex) });
            await this.waitForElementInvisible(dropdown);
        }
    }

    async clickItemInDropdown(objectName) {
        const option = await this.getDropdownOption(objectName);
        await this.click({ elem: option });
    }

    async removeAllObjectsSelected(ruleIndex) {
        await this.click({ elem: this.getDeleteBtnForBasedOnAllObjectLabel(ruleIndex) });
    }

    async isEditIconPresentForBasedOnDropdown(objectName) {
        await this.inputTermForSearchDropdown(objectName);
        const editIcon = await this.getDropdownOptionEditIcon(objectName);
        return await editIcon.isExisting();
    }

    async removeBasedOnObjectByName(ruleIndex, objectName) {
        await this.click({ elem: this.getDeleteButtonForBasedOnObject(ruleIndex, objectName) });
    }

    async clickAddButtonForOtherRules(ruleIndex, label) {
        await this.click({ elem: this.getAddButtonByLabel(ruleIndex, label) });
    }

    async isAddButtonForOtherRulesDisabled(ruleIndex, label) {
        const addButton = this.getAddButtonByLabel(ruleIndex, label);
        return await this.isAriaDisabled(addButton);
    }

    // Action - Filter
    async configFilter(whenText = '', objectLabel, operator = '=', value) {
        // add when text
        const whenInput = await this.getWhenInput();
        await whenInput.setValue(whenText);

        // click object option
        await this.click({ elem: this.getFilterDropdownTrigger() });
        await this.waitForElementVisible(this.getDropdown());
        const option = await this.getDropdownOption(objectLabel);
        await this.click({ elem: option });

        // set operator
        await this.click({ elem: this.getFilterOperatorDropdownTrigger() });
        await this.waitForElementVisible(this.getDropdown());
        const operatorOption = await this.getDropdownOption(operator);
        await this.click({ elem: operatorOption });
        
        // set value behind operator
        const valueInput = await this.getFilterValueInput();
        await valueInput.setValue(value);
    }

    async removeFilterByIndex(ruleIndex, filterIndex) {
        const filterItem = await this.getFilterItemContainerByIndex(ruleIndex, filterIndex);
        await this.hover({ elem: filterItem });
        const deleteButton = await this.getFilterItemButton(ruleIndex, filterIndex, 'Delete');
        await this.click({ elem: deleteButton });
    }

    async editFilterByIndex(ruleIndex, filterIndex) {
        const filterItem = await this.getFilterItemContainerByIndex(ruleIndex, filterIndex);
        await this.hover({ elem: filterItem });
        const editButton = await this.getFilterItemButton(ruleIndex, filterIndex, 'Edit');
        await this.click({ elem: editButton });
    }

    // Action - Order By

    async configOrderBy(whenText = '', objectLabel, clickSort = false) {
        const whenInput = await this.getWhenInput();
        await whenInput.setValue(whenText);

        // click Order by object
        await this.click({ elem: this.getOrderByGroupByDropdownTrigger() });
        await this.waitForElementVisible(this.getDropdown());
        const searchInput = await this.getSearchInputForDropdown();
        await searchInput.setValue(objectLabel);
        const option = await this.getDropdownOption(objectLabel);
        await this.click({ elem: option });

        // set order
        if (clickSort) {
            await this.click({ elem: this.getOrderBySortButton() });
        }
    }

    async editOrderByByIndex(ruleIndex, orderByIndex) {
        const orderByItem = await this.getOrderByItemByIndex(ruleIndex, orderByIndex);
        await this.hover({ elem: orderByItem });
        const editButton = await this.getOrderByItemEditButton(ruleIndex, orderByIndex);
        await this.click({ elem: editButton });
    }

    async removeOrderByByIndex(ruleIndex, orderByIndex) {
        const orderByItem = await this.getOrderByItemByIndex(ruleIndex, orderByIndex);
        await this.hover({ elem: orderByItem });
        const deleteButton = await this.getOrderByItemDeleteButton(ruleIndex, orderByIndex);
        await this.click({ elem: deleteButton });
    }

    async dragAndDropOrderByItem(ruleIndex, sourceIndex, targetIndex) {
        const sourceItem = this.getOrderByItemByIndex(ruleIndex, sourceIndex);
        const targetItem = this.getOrderByItemByIndex(ruleIndex, targetIndex);
        await this.dragAndDrop({ fromElem: sourceItem, toElem: targetItem });
    }

    // Action - Group By
    async configGroupBy(whenText = '', objectNames) {
        const objectNamesArray = Array.isArray(objectNames) ? objectNames : [objectNames];
        const whenInput = await this.getWhenInput();
        await whenInput.setValue(whenText);
        // click Group by object
        await this.click({ elem: this.getOrderByGroupByDropdownTrigger() });
        await this.waitForElementVisible(this.getDropdown());
        const searchInput = await this.getSearchInputForDropdown();
        for (const objectLabel of objectNamesArray) {
            await searchInput.setValue(objectLabel);
            const option = await this.getDropdownOption(objectLabel);
            await this.click({ elem: option });
        }
    }

    async editGroupByByIndex(ruleIndex, groupByIndex) {
        const groupByItem = await this.getGroupByItemByIndex(ruleIndex, groupByIndex);
        await this.hover({ elem: groupByItem });
        const editButton = await this.getGroupByItemEditButton(ruleIndex, groupByIndex);
        await this.click({ elem: editButton });
    }

    async removeGroupByByIndex(ruleIndex, groupByIndex) {
        const groupByItem = await this.getGroupByItemByIndex(ruleIndex, groupByIndex);
        await this.hover({ elem: groupByItem });
        const deleteButton = await this.getGroupByItemDeleteButton(ruleIndex, groupByIndex);
        await this.click({ elem: deleteButton });
    }

    async dragAndDropGroupByItem(ruleIndex, sourceIndex, targetIndex) {
        const sourceItem = this.getGroupByItemByIndex(ruleIndex, sourceIndex);
        const targetItem = this.getGroupByItemByIndex(ruleIndex, targetIndex);
        await this.dragAndDrop({ fromElem: sourceItem, toElem: targetItem });
    }


    // Based On Object configuration
    async expandBasedOnObjectCollapseArrowByName(ruleIndex, basedOnObject) {
        await this.click({ elem: this.getBasedOnObjectCollapseButton(ruleIndex, basedOnObject) });
        await this.waitForElementVisible(this.getBasedOnConfigurationSection(ruleIndex, basedOnObject));
    }

    async clickAddButtonInBasedOnObjectConfiguration(ruleIndex, basedOnObject) {
        await this.click({ elem: this.getBasedOnConfigurationAddButton(ruleIndex, basedOnObject) });
    }

    async clickBasedOnConfigurationActionDropdown(ruleIndex, basedOnObject) {
        await this.click({ elem: this.getBasedOnConfigurationActionDropdownTrigger(ruleIndex, basedOnObject) });
        await this.waitForElementVisible(this.getDropdown());
    }

    async addBasedOnObjectConfiguration(ruleIndex, basedOnObject, action = 'Require') {
        await this.clickAddButtonInBasedOnObjectConfiguration(ruleIndex, basedOnObject);
        if (action !== 'Require') {
            await this.clickBasedOnConfigurationActionDropdown(ruleIndex, basedOnObject);
            const actionOption = await this.getDropdownOption(action);
            await this.click({ elem: actionOption });
        }
    }

    async selectMultipleObjectsInBasedOnObjectConfigurationDropdown(ruleIndex, basedOnObject, objectNames) {
        const objectNamesArray = Array.isArray(objectNames) ? objectNames : [objectNames];
        // Click on the dropdown to open it
        await this.click({ elem: this.getBasedOnConfigurationObjectDropdownTrigger(ruleIndex, basedOnObject) });
        await this.waitForElementVisible(this.getDropdown());
        for (const objectLabel of objectNamesArray) {
            const searchInput = await this.getSearchInputForDropdown();
            await searchInput.setValue(objectLabel);
            const option = await this.getDropdownOption(objectLabel);
            await this.click({ elem: option });
        }
    }

    async removeBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex) {
        const configItem = await this.getBasedOnConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex);
        await this.hover({ elem: configItem });
        const deleteButton = this.getBasedOnConfigurationItemButton(ruleIndex, basedOnObject, configIndex, 'Delete');
        await this.click({ elem: deleteButton });
    }

    async editBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex, action) {
        const configItem = await this.getBasedOnConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex);
        await this.hover({ elem: configItem });
        const editButton = this.getBasedOnConfigurationItemButton(ruleIndex, basedOnObject, configIndex, 'Edit');
        await this.click({ elem: editButton });
        if (action) {
            await this.click({ elem: this.getBasedOnConfigurationActionDropdownTrigger(ruleIndex, basedOnObject) });
            await this.waitForElementVisible(this.getDropdown());
            const actionOption = await this.getDropdownOption(action);
            await this.click({ elem: actionOption });
        }
    }

    // Action - Advanced Settings
    async expandAdvancedSettings(ruleIndex) {
        await this.click({ elem: this.getAdvancedSettingsToggleButton(ruleIndex) });
        await this.waitForElementVisible(this.getAdvancedSettingsContent(ruleIndex));
    }

    async configTimeinAdvancedSettings(whenText='', dimension, value) {
        const whenInput = await this.getWhenInput();
        await whenInput.setValue(whenText);
        // set Dimension
        await this.click({ elem: this.getDropdownTriggerInAdvancedSettings(0) });
        await this.waitForElementVisible(this.getDropdown());
        const searchInput = await this.getSearchInputForDropdown();
        await searchInput.setValue(dimension);
        const option = await this.getDropdownOption(dimension);
        await this.click({ elem: option });
        // set Value
        const valueInput = await this.getValueInputInAdvancedSettings();
        await valueInput.setValue(value);
    }

    async configPreferenceInAdvancedSettings(whenText='', oneObjectOption = false, objectLabel1, objectLabel2) {
        const whenInput = await this.getWhenInput();
        await whenInput.setValue(whenText);
        const radioButtons = await this.getPreferenceRadiosInAdvancedSettings();
        // set Then
        if (oneObjectOption) {
            await this.click({ elem: radioButtons[1] }); // Select one object option
            const dropdown = await this.getDropdownTriggerInAdvancedSettings(2);
            await this.click({ elem: dropdown });
            await this.waitForElementVisible(this.getDropdown());
            const searchInput = await this.getSearchInputForDropdown();
            await searchInput.setValue(objectLabel1);
            const option = await this.getDropdownOption(objectLabel1);
            await this.click({ elem: option });
        } else {
            await this.click({ elem: radioButtons[0] }); // Select 2 objects option
            // set first object
            const dropdown1 = await this.getDropdownTriggerInAdvancedSettings(0);
            await this.click({ elem: dropdown1 });
            await this.waitForElementVisible(this.getDropdown());
            const searchInput1 = await this.getSearchInputForDropdown();
            await searchInput1.setValue(objectLabel1);
            const option1 = await this.getDropdownOption(objectLabel1);
            await this.click({ elem: option1 });
            // set second object
            const dropdown2 = await this.getDropdownTriggerInAdvancedSettings(1);
            await this.click({ elem: dropdown2 });
            await this.waitForElementVisible(this.getDropdown());
            const searchInput2 = await this.getSearchInputForDropdown();
            await searchInput2.setValue(objectLabel2);
            const option2 = await this.getDropdownOption(objectLabel2);
            await this.click({ elem: option2 });
        }
    }

    async configGuardsInAdvancedSettings(whenText='', objectNames) {
        const objectNamesArray = Array.isArray(objectNames) ? objectNames : [objectNames];
        const whenInput = await this.getWhenInput();
        await whenInput.setValue(whenText);
        const dropdown = await this.getDropdownTriggerInAdvancedSettings(0);
        await this.click({ elem: dropdown });
        await this.waitForElementVisible(this.getDropdown());
        for (const objectLabel of objectNamesArray) {
            const searchInput = await this.getSearchInputForDropdown();
            await searchInput.setValue(objectLabel);
            const option = await this.getDropdownOption(objectLabel);
            await this.click({ elem: option });
        }
    }

    async removeAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex) {
        const item = await this.getAdvancedSettingsRuleItem(ruleIndex, sectionIndex, itemIndex);
        await this.hover({ elem: item });
        const deleteButton = this.getAdvancedSettingsRuleItemButton(ruleIndex, sectionIndex, itemIndex, 'Delete');
        await this.click({ elem: deleteButton });
    }

    // sectionIndex: 0 - Time, 1 - Preference, 2 - Guards
    async editAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex) {
        const item = await this.getAdvancedSettingsRuleItem(ruleIndex, sectionIndex, itemIndex);
        await this.hover({ elem: item });
        const editButton = this.getAdvancedSettingsRuleItemButton(ruleIndex, sectionIndex, itemIndex, 'Edit');
        await this.click({ elem: editButton });
    }
}