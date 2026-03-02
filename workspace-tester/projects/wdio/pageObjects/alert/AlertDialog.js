import Subscribe from '../export/Subscribe.js';
import ShareDossierDialog from '../dossier/ShareDossierDialog.js';

export default class AlertDialog extends Subscribe {
    constructor() {
        super();
        this.shareDossierDialog = new ShareDossierDialog();
    }

    // Element locators

    getAlertPanel() {
        return this.$('.mstrd-AlertDetailsDialog-main,.mstrd-SubscriptionEditDialog-main');
    }

    getAlertPanelTitle() {
        return this.$('.mstrd-AlertDetailsDialog-title');
    }

    getHighlightedMetricPicker() {
        return this.getAlertPanel().$('.mstrd-SubscriptionSettings-highlightedMetricPicker');
    }

    getHighlightedMetricDropdown() {
        return this.getHighlightedMetricPicker().$('.mstrd-DropDown-content');
    }

    getHighlightedMetricDropdownColumnSets() {
        return this.getHighlightedMetricDropdown().$$('.mstrd-OptGroup-label');
    }

    getHighlightedMetricDropdownItems(name) {
        return this.getHighlightedMetricDropdown()
            .$$('.mstrd-Option')
            .filter(async (elem) => (await elem.getText()).includes(name))[0];
    }

    getHighlightedMetricFormat() {
        return this.getAlertPanel().$('.mstrd-SubscriptionSettings-highlightedMetricColorTrigger');
    }

    getHighlightedMetricColorPicker() {
        return this.$('.mstrd-SubscriptionSettings-highlightedMetricColorPopoverContent');
    }

    getHighlightedMetricColorPickerOption(name) {
        return this.getHighlightedMetricColorPicker()
            .$$('.mstrd-SubscriptionSettings-colorPickerWrapper')
            .filter(async (elem) => (await elem.getText()).includes(name))[0];
    }

    getHighlightedMetricColorPickerOptionInput(name) {
        return this.getHighlightedMetricColorPickerOption(name).$('.mstrd-SubscriptionSettings-colorPickerInput');
    }

    getColorPalette() {
        return this.$('.mstrd-SubscriptionSettings-colorPicker__content');
    }

    getColorPaletteItem(name) {
        return this.getColorPalette()
            .$$('.mstr-rc-3-color-grid button')
            .filter(async (elem) => {
                const text = await elem.getAttribute('aria-label');
                return text.includes(name);
            })[0];
    }

    getAddConditionButton() {
        return this.getAlertPanel().$('.mstrd-SubscriptionSettings-conditionAddButton');
    }

    getConditionSection() {
        return this.getAlertPanel()
            .$$('.mstrmojo-ThresholdExprTree')
            .filter(async (elem) => {
                const style = await elem.getAttribute('style');
                return style.includes('display: block');
            })[0];
    }

    getGroupConditions() {
        return this.getConditionSection().$$('.mstrmojo-andor-contentsWrapper');
    }

    getGroupConditionByIndex(index) {
        return this.getConditionSection().$$('.mstrmojo-andor-contentsWrapper')[index - 1];
    }

    getSendThrough() {
        return this.getAlertPanel().$('.mstrd-SubscriptionSettings-sendThroughSetting .mstrd-DropDownButton-label');
    }

    getSendThroughDropdownOptions() {
        return this.getAlertPanel().$('.mstrd-SubscriptionSettings-sendThroughSetting .mstrd-DropDown-content').$$('.mstrd-Option');
    }

    getSendThroughDropdownOptionByName(name) {
        return this.getSendThroughDropdownOptions().filter(async (elem) => (await elem.getText()).includes(name))[0];
    }

    getTargetDevice() {
        return this.getAlertPanel().$('.mstrd-SubscriptionSettings-sendTargetDevicesSetting .mstrd-DropDownButton-label');
    }

    getTargetDeviceOptions() {
        return this.getAlertPanel().$('.mstrd-SubscriptionSettings-sendTargetDevicesSetting .mstrd-DropDown-content').$$('.mstrd-Option');
    }

    getTargetDeviceDropdownOptionByName(name) {
        return this.getTargetDeviceOptions().filter(async (elem) => (await elem.getText()).includes(name))[0];
    }

    async getConditionItemByTitle(title, itemIndex = 1) {
        const els = this.getConditionItems();
        const length = await els.length;
        let targets = [];
        for (let i = 0; i < length; i++) {
            let el = els[i];
            // filter group items
            const subel = el.$$('.mstrmojo-itemwrap');
            if ((await subel.length) > 1) {
                continue;
            }
            let text = await this.getTitle(el.$('.mstrmojo-cond-text'));
            // try 3 times to get the expression due to parameter one loaded
            for (let j = 0; j < 3; j++) {
                if (text != '') {
                    break;
                }
                await this.sleep(1000);
                text = await this.getTitle(el.$('.mstrmojo-cond-text'));
            }
            if (text.includes(title)) {
                targets.push(el);
            }
        }
        if (targets.length === 0) {
            return null;
        }
        return targets[itemIndex - 1];
    }

    getConditionItems() {
        return this.getConditionSection().$$('.mstrmojo-itemwrap');
    }

    getConditionItemsByGroupIndex(index) {
        return this.getGroupConditionByIndex(index).$$('.mstrmojo-itemwrap');
    }

    getConditionItemByIndexByGroupIndex(index, groupIndex) {
        return this.getConditionItemsByGroupIndex(groupIndex)[index - 1];
    }

    getConditionOperator(conditionItem) {
        return conditionItem.$('.mstrmojo-andor');
    }

    getConditionItemGroup(conditionItem) {
        return conditionItem.$('.mstrmojo-indent');
    }

    getConditionItemUngroup(conditionItem) {
        return conditionItem.$('.mstrmojo-outdent');
    }

    getOperatorDropDown() {
        return this.$('.mstrmojo-ui-Menu-item-container');
    }

    getOperatorDropDownItems() {
        return this.getOperatorDropDown().$$('.mstrmojo-ui-Menu-item');
    }

    getOperatorDropDownItemByName(name) {
        return this.getOperatorDropDownItems().filter(async (elem) => {
            const text = await elem.getText();
            return text.includes(name);
        })[0];
    }

    getShowFilterCheckbox() {
        return this.$('.mstrd-SubscriptionSettings-excelFilter .mstrd-Checkbox-label');
    }

    getAddToSnapshotCheckbox() {
        return this.$('.mstrd-SubscriptionSettings-format-snapshot .mstrd-Checkbox-shape');
    }

    getDefaultRange() {
        return this.$('.mstrd-TreeSelect .mstrd-DropDownButton-label');
    }
    getConditionDialog() {
        return this.$('.mstrd-SubscriptionSettings-conditionEditor');
    }

    getAlertSearchList() {
        return this.$('.mstrd-RecipientSearchResults');
    }

    getRecipientInAlert() {
        return this.getAlertSearchList().$('.mstrd-RecipientUser-name .mstrd-RecipientUser-loginName');
    }

    getRangeDropdown() {
        return this.$('.mstrd-TreeSelect');
    }

    getConditionEditor() {
        return this.$('.mstrd-SubscriptionSettings-conditionEditor');
    }

    getConditionElement(name) {
        return this.getConditionEditor().$(`//*[text()='${name}']`);
    }

    getCreateAlertButton() {
        return this.$('.mstrd-AlertDetailsDialog-save');
    }

    getCancelAlertButton() {
        return this.$('.mstrd-AlertDetailsDialog-cancel');
    }

    getConditionInfoIcon() {
        return this.$('.mstrd-SubscriptionEditor-item .mstrd-InfoIcon');
    }

    getAddToSnapshotInfoIcon() {
        return this.$('.mstrd-SubscriptionSettings-format-snapshot .mstrd-InfoIcon');
    }

    getAlertTypeInSidebar(name) {
        return this.getSubscriptionInSidebar(name).$('//div[text()="Alert"]');
    }

    getEditBtnInSidebar(name) {
        return this.getSubscriptionInSidebar(name).$('span[class*="icon-subscrip_edit"]');
    }

    getFilterPanelInSidebar() {
        return this.$('.mstrd-SubscriptionFilterDropdown .mstrd-CheckboxList');
    }

    getSubscriptionFiltersType(name) {
        return this.getSubscriptionFilterContainer()
            .$$('.mstrd-SubscriptionFilterDropdown-category')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(name);
            })[0];
    }

    getConditionExpr() {
        return this.$('.mstrmojo-ThresholdExprTree');
    }

    getAlertTypeInInfoWindow() {
        return this.$('//p[text()="Alert"]');
    }

    getSubscriptionDetailsInInfoWindow() {
        return this.$('.mstrd-SubscriptionInfo-details');
    }

    getSubscriptionSwitcher() {
        return this.$('.mstrd-SubscriptionInfo-subscriptionSwitcher');
    }

    getCloseButton() {
        return this.$('.mstrd-AlertDetailsDialog-headerIcons .icon-pnl_close');
    }

    // Alert dialogue actions

    async clickSubscriptionSwitcher() {
        await this.click({ elem: this.getSubscriptionSwitcher() });
    }

    async clickRangeDropdown() {
        const dropdown = await this.getRangeDropdown();
        await this.waitForElementVisible(dropdown);
        await this.click({ elem: dropdown });
        // // Wait for dropdown to be expanded
        // await browser.waitUntil(async () => {
        //     const expanded = await dropdown.getAttribute('aria-expanded');
        //     return expanded === 'true';
        // }, 'Range dropdown did not expand after clicking');
    }

    async selectRange(dropDownOption) {
        await this.clickRangeDropdown();

        if (dropDownOption === '(All)') {
            const allOption = await this.$('.mstrd-TreeSelect-all');
            await this.click({ elem: allOption });
        } else {
            const option = await this.$(`.mstrd-TreeSelect-option=${dropDownOption}`);
            await this.click({ elem: option });
        }

        // // Wait for dropdown to close
        // const dropdown = await this.getRangeDropdown();
        // await this.waitUntil(async () => {
        //     const expanded = await dropdown.getAttribute('aria-expanded');
        //     return expanded === 'false';
        // }, 'Range dropdown did not close after selection');
    }

    async clickSubscriptionFiltersType(name) {
        await this.click({ elem: this.getSubscriptionFiltersType(name) });
    }

    async createAlert() {
        await this.click({ elem: this.$('.mstrd-AlertDetailsDialog-save,.mstrd-SubscriptionEditDialog-save') });
    }

    async cancelAlert() {
        await this.clickSidebarCancel();
    }

    async clickAddToSnapshotCheckbox() {
        await this.click({ elem: this.getAddToSnapshotCheckbox() });
    }

    async clickShowFilterCheckbox() {
        await this.click({ elem: this.getShowFilterCheckbox() });
    }

    async selectHighlightedMetric(name) {
        await this.waitForElementVisible(this.getAlertPanel());
        await this.click({ elem: this.getHighlightedMetricPicker() });
        await this.waitForElementVisible(this.getHighlightedMetricDropdown());
        await this.click({ elem: this.getHighlightedMetricDropdownItems(name) });
        await this.waitForElementInvisible(this.getHighlightedMetricDropdown());
    }

    async openHighlightedMetricDropdown() {
        await this.waitForElementVisible(this.getAlertPanel());
        await this.click({ elem: this.getHighlightedMetricPicker() });
        await this.waitForElementVisible(this.getHighlightedMetricDropdown());
    }

    async closeHighlightedMetricDropdown() {
        await this.waitForElementVisible(this.getHighlightedMetricDropdown());
        await this.click({ elem: this.getHighlightedMetricPicker() });
        await this.waitForElementInvisible(this.getHighlightedMetricDropdown());
    }

    async selectHighlightedMetricFormat(fillColor, fontColor) {
        await this.click({ elem: this.getHighlightedMetricFormat() });
        await this.waitForElementVisible(this.getHighlightedMetricColorPicker());
        await this.click({ elem: this.getHighlightedMetricColorPickerOptionInput('Fill color') });
        await this.waitForElementVisible(this.getColorPalette());
        await this.click({ elem: this.getColorPaletteItem(fillColor) });
        await this.click({ elem: this.getHighlightedMetricColorPickerOption('Fill color') });
        await this.waitForElementInvisible(this.getColorPalette());
        await this.click({ elem: this.getHighlightedMetricColorPickerOptionInput('Font color') });
        await this.waitForElementVisible(this.getColorPalette());
        await this.click({ elem: this.getColorPaletteItem(fontColor) });
        await this.click({ elem: this.getHighlightedMetricColorPickerOption('Font color') });
        await this.waitForElementInvisible(this.getColorPalette());
        await this.click({ elem: this.getHighlightedMetricFormat() });
        await this.waitForElementInvisible(this.getHighlightedMetricColorPicker());
    }

    async addCondition() {
        await this.click({ elem: this.getAddConditionButton() });
        await this.waitForElementVisible(this.getConditionDialog());
    }

    async editCondition(conditionIndex, groupIndex = 1) {
        await this.click({ elem: this.getConditionItemByIndexByGroupIndex(conditionIndex, groupIndex) });
        await this.waitForElementVisible(this.getConditionDialog());
    }

    async editConditionByTitle(title) {
        const el = await this.getConditionItemByTitle(title);
        await this.click({ elem: el.$('.mstrmojo-cond-contents') });
        await this.waitForElementVisible(this.getConditionDialog());
    }

    async updateConditionOperator(title, operator, itemIndex = 1) {
        await this.waitForElementVisible(this.getAddConditionButton());
        const condition = await this.getConditionItemByTitle(title, itemIndex);
        await this.click({ elem: this.getConditionOperator(condition) });
        await this.waitForElementVisible(this.getOperatorDropDown());
        await this.click({ elem: this.getOperatorDropDownItemByName(operator) });
        await this.waitForElementInvisible(this.getOperatorDropDown());
        await this.sleep(500);
    }

    async deleteCondition(title, itemIndex = 1) {
        await this.waitForElementVisible(this.getAddConditionButton());
        const condition = await this.getConditionItemByTitle(title, itemIndex);
        const el = condition.$('.mstrmojo-cond-contents');
        await this.hover({ elem: el });
        await this.click({ elem: condition.$('.mstrmojo-cond-tools') });
    }

    async groupCondition(title, itemIndex = 1) {
        let condition = await this.getConditionItemByTitle(title, itemIndex);
        await this.click({ elem: this.getConditionItemGroup(condition) });
        condition = await this.getConditionItemByTitle(title, itemIndex);
        await this.waitForElementVisible(this.getConditionItemUngroup(condition));
    }

    async ungroupCondition(title, itemIndex = 1) {
        let condition = await this.getConditionItemByTitle(title, itemIndex);
        await this.click({ elem: this.getConditionItemUngroup(condition) });
        condition = await this.getConditionItemByTitle(title, itemIndex);
        await this.waitForElementVisible(this.getConditionItemGroup(condition));
    }

    async dragAndDropConditionItem(fromItem, toItem) {
        await this.waitForElementVisible(this.getAddConditionButton());
        const from = await this.getConditionItemByTitle(fromItem);
        const fromEl = from.$('.mstrmojo-cond-contents');
        const to = await this.getConditionItemByTitle(toItem);
        const toEl = to.$('.mstrmojo-andor');
        await this.dragAndDropForCondition({
            fromElem: fromEl,
            toElem: toEl,
        });
    }

    async selectSendThroughOption(name) {
        await this.waitForElementVisible(this.getAddConditionButton());
        await this.click({ elem: this.getSendThrough() });
        const option = await this.getSendThroughDropdownOptionByName(name);
        await this.click({ elem: option });
    }

    async selectTargetDevices(nameList) {
        await this.click({ elem: this.getTargetDevice() });
        for (const name of nameList) {
            const option = await this.getTargetDeviceDropdownOptionByName(name);
            await this.click({ elem: option });
        }
        // click the label again to close target device dropdown
        await this.click({ elem: this.getTargetDevice() });
    }

    async closeAlertDialog() {
        const isOpened = await this.getAlertPanel().isDisplayed();
        if (isOpened) {
            await this.click({ elem: this.getCloseButton() });
        }
    }

    async addRecipients(usernames) {
        for (const user of usernames) {
            await this.shareDossierDialog.searchRecipient(user, false);
            await this.shareDossierDialog.selectRecipients([user]);
        }
    }

    // Assertion helpers
    getAlertTypeByName(name) {
        return this.getSubscriptionInSidebar(name).$('div[text()="Alert"]').isDisplayed();
    }

    async getRowBySubscriptionName(subscriptionName) {
        const rows = await $$('.ReactVirtualized__Table__row');
        for (let row of rows) {
            const subscriptionCell = await row.$('.mstrd-SubscriptionListContainer-subscription--nameColumn');
            const cellText = await subscriptionCell.getText();
            if (cellText === subscriptionName) {
                return row;
            }
        }

        console.log(`Subscription with name "${subscriptionName}" not found.`);
        return null;
    }

    async getSubscriptionTypeByName(subscriptionName) {
        // Use the appropriate selector to find the rows in the table
        const row = await this.getRowBySubscriptionName(subscriptionName);
        if (row == null) {
            return null;
        }
        const typeCell = await row.$$('.ReactVirtualized__Table__rowColumn')[2];
        const typeText = await typeCell.getText();
        return typeText;
    }

    async getEditButtonFromRow(subscriptionName) {
        const row = await this.getRowBySubscriptionName(subscriptionName);
        if (row) {
            const editButton = await row.$('.mstr-menu-icon.icon-subscrip_edit');
            return editButton;
        }
        console.log('Row is not available.');
        return null;
    }

    async editSubscription(subscriptionName) {
        const editButton = await this.getEditButtonFromRow(subscriptionName);
        if (editButton) {
            await editButton.moveTo();
            await editButton.click();
            await this.waitForElementVisible(this.getAlertPanel());
        } else {
            console.log('Edit button is not available.');
        }
    }

    async isSnapshotInFormatPresent() {
        await (await this.getFormatDropdown()).open();
        return (await this.getFormatDropdown()).getOption('Snapshot').isDisplayed();
    }

    async isShowFilterPresent() {
        return this.getShowFilterCheckbox().isDisplayed();
    }

    async isAddToSnapshotPresent() {
        return this.getAddToSnapshotCheckbox().isDisplayed();
    }

    async isAddToSnapshotChecked() {
        const el = this.getParent(this.getAddToSnapshotCheckbox());
        const value = await el.getAttribute('aria-checked');
        return value;
    }

    async getConditionExpression() {
        await this.waitForElementVisible(this.getAddConditionButton());
        const els = this.getConditionItems();
        const length = await els.length;
        const text = [];
        for (let i = 0; i < length; i++) {
            const el = els[i];
            // filter group items
            await this.waitForElementVisible(el);
            const subel = el.$$('.mstrmojo-itemwrap');
            if ((await subel.length) > 1) {
                continue;
            }
            let conditonItemExpression = await this.getTitle(el.$('.mstrmojo-cond-text'));
            // try 10 times to get the expression due to parameter one loaded
            for (let j = 0; j < 10; j++) {
                if (conditonItemExpression != '') {
                    break;
                }
                await this.sleep(1000);
                conditonItemExpression = await this.getTitle(el.$('.mstrmojo-cond-text'));
            }
            if (conditonItemExpression != '') {
                text.push(conditonItemExpression);
            }
        }
        return text;
    }

    async getExcludeConditionExpression() {
        await this.waitForElementVisible(this.getAddConditionButton());
        const els = this.getConditionItems();
        const length = await els.length;
        const text = [];
        for (let i = 0; i < length; i++) {
            const el = els[i];
            // filter group items
            const subel = el.$$('.mstrmojo-itemwrap');
            if ((await subel.length) > 1) {
                continue;
            }
            const elems = el.$$('.mstrmojo-elem.descendant.not');
            const v = await elems.length;
            for (let j = 0; j < (await elems.length); j++) {
                const conditonItemExpression = await elems[j].getText();
                if (conditonItemExpression != '') {
                    text.push(conditonItemExpression);
                }
            }
        }

        return text;
    }

    async getAllOperatorsValue() {
        await this.waitForElementVisible(this.getAddConditionButton());
        const els = this.getConditionItems();
        const length = await els.length;
        const text = [];
        for (let i = 0; i < length; i++) {
            const el = els[i];
            // filter group items
            const subel = el.$$('.mstrmojo-itemwrap');
            if ((await subel.length) > 1) {
                const subOperator = await el.$$('.mstrmojo-text.mstrmojo-andor')[0].getText();
                if (subOperator != '') {
                    text.push(subOperator);
                }
                continue;
            }
            const operator = await this.getConditionOperator(els[i]).getText();
            if (operator != '') {
                text.push(operator);
            }
        }
        return text;
    }

    async getConditionGroupsCount() {
        await this.waitForElementVisible(this.getAddConditionButton());
        const value = await this.getGroupConditions().length;
        return value - 1;
    }

    async isGroupIconDisplayedInConditionItem(title, itemIndex = 1) {
        const condition = await this.getConditionItemByTitle(title, itemIndex);
        await this.waitForElementVisible(condition);
        return this.getConditionItemGroup(condition).isDisplayed();
    }

    async isUngroupIconDisplayedInConditionItem(title, itemIndex = 1) {
        const condition = await this.getConditionItemByTitle(title, itemIndex);
        await this.waitForElementVisible(condition);
        return this.getConditionItemUngroup(condition).isDisplayed();
    }

    async getConditionOperatorValue(conditionIndex, groupIndex) {
        const value = await this.getConditionOperatorByItemIndexByGroupIndex(conditionIndex, groupIndex).getText();
        return value;
    }

    async getHighlightedMetricColorFormat() {
        const value = [];
        await this.click({ elem: this.getHighlightedMetricFormat() });
        await this.waitForElementVisible(this.getHighlightedMetricColorPicker());
        const fillColor = await this.getHighlightedMetricColorPickerOption('Fill color')
            .$('.mstrd-SubscriptionSettings-colorPicker__color-preview')
            .getCSSProperty('background-color');
        value.push(await fillColor.value);
        const fontColor = await this.getHighlightedMetricColorPickerOption('Font color')
            .$('.mstrd-SubscriptionSettings-colorPicker__color-preview')
            .getCSSProperty('background-color');
        value.push(await fontColor.value);
        await this.click({ elem: this.getHighlightedMetricFormat() });
        await this.waitForElementInvisible(this.getHighlightedMetricColorPicker());
        return value;
    }

    async getHighlightedMetricOptionValue() {
        await this.waitForElementVisible(this.getAddConditionButton());
        return this.getHighlightedMetricPicker().getText();
    }

    async getHighlightedMetricDropdownColumnSetsValue() {
        await this.openHighlightedMetricDropdown();
        const value = await this.getHighlightedMetricDropdownColumnSets().map(async (elem) => {
            return await elem.getText();
        });
        await this.closeHighlightedMetricDropdown();
        return value;
    }

    async cancelCreateAlert() {
        await this.click({ elem: this.getCloseButton() });
        // Wait for dialog to close
        await this.waitForElementInvisible(this.getAlertPanel());
    }

    async clickConditionInfoIcon() {
        await this.click({ elem: this.getConditionInfoIcon() });
    }

    async clickAddToSnapshotInfoIcon() {
        await this.click({ elem: this.getAddToSnapshotInfoIcon() });
    }

    async getCurrentAlertType() {
        await this.waitForElementVisible(this.getAddConditionButton());
        return this.getSendThrough().getText();
    }

    async isTargetDeviceSectionVisible() {
        await this.waitForElementVisible(this.getAddConditionButton());
        return this.getTargetDevice().isDisplayed();
    }

    async getCurrentTargetDevices() {
        await this.waitForElementVisible(this.getAddConditionButton());
        return this.getTargetDevice().getText();
    }

}
