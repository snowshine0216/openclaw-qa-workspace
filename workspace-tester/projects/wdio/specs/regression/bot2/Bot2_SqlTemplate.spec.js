import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { botUser3 } from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { bot } from '../../../constants/teams.js';



describe('Agent Rules panel', () => {
    const { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, botRulesSettings, aibotChatPanel } = browsers.pageObj1;
    const bot_sql_template = {
        id: 'F061F250A6E04B35BD851D30F7D184DD',
        name: 'AUTO_BOT_SQLTemplate',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    const attr1 = 'Airline Name (ID)';
    const attr2 = 'Category (DESC)';
    const metric1 = 'Avg Delay (min)';
    const metric2 = 'Profit';
    const attrExclude = 'Category (ID)';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botUser3);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');

        const i = await botRulesSettings.getCountOfRuleItems();
        for (let index = i - 1; index >= 0; index--) {
            await botRulesSettings.deleteRuleByIndex(index);
        }
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99032_1] Manipulations on Based On', async () => {
        const modifiedRuleName = 'modified rule name';
        await botRulesSettings.addNewRule();

        await since('Before Based on object added, the add filter by button should be disabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'FILTERS')).toBe(true);
        await since('Before Based on object added, the add order by button should be disabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'Order By')).toBe(true);
        await since('Before Based on object added, the add group by button should be disabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'Group By')).toBe(true);

        // add based on objects
        await botRulesSettings.addBasedOnObjectsBySelection(0, [attr1, metric1]);
        await botRulesSettings.addBasedOnObjectsBySearch(0, [attr2, metric2, attrExclude]);

        await since('After Based on object added, the add filter by button should be Enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'FILTERS')).toBe(false);
        await since('After Based on object added, the add order by button should be Enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'Order By')).toBe(false);
        await since('After Based on object added, the add group by button should be Enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'Group By')).toBe(false);

        await botRulesSettings.removeBasedOnObjectByName(0, attr2);
        await botRulesSettings.removeBasedOnObjectByName(0, metric2);
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnList(0),
            'TC99032_1',
            'Add rule - Based On'
        );
        // add a new rule and rename
        await botRulesSettings.addNewRule();
        await since('There should be 2 rules after add new rule')
            .expect(await botRulesSettings.getCountOfRuleItems())
            .toBe(2);
        await since('The default rule name should be New Rule 2 for the 2nd rule')
            .expect(await botRulesSettings.getRuleNameInput(1).getValue())
            .toBe('New Rule 2');
        await botRulesSettings.renameRuleByIndex(1, modifiedRuleName);
        await since('The rule name should be #{expected} after rename, instead got #{actual}')
            .expect(await botRulesSettings.getRuleNameInput(1).getValue())
            .toBe(modifiedRuleName);
        // save and reopen to check the edit persisted
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });  
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnList(0),
            'TC99032_1',
            'Check saved Based On after reopen'
        );
        await since('There should be 2 rules after reopen, instead got #{actual}')
            .expect(await botRulesSettings.getCountOfRuleItems())
            .toBe(2);
        await since('The rule name should be #{expected} after reopen, instead got #{actual}')
            .expect(await botRulesSettings.getRuleNameInput(1).getValue())
            .toBe(modifiedRuleName);

    });

    it('[TC99032_2] Add Filter rule', async () => {
        await botRulesSettings.addNewRule();
        await botRulesSettings.addBasedOnObjectsBySelection(0, [attr1, metric1]);

        // config filter
        await botRulesSettings.clickAddButtonForOtherRules(0, 'FILTERS');
        await botRulesSettings.configFilter('airline is US airways', attr1, '=', 'US Airways Inc.');
        await takeScreenshotByElement(
            botRulesSettings.getGeneralItemEditingContainer(),
            'TC99032_2',
            'Add rule - Filter editing'
        );
        await botRulesSettings.clickAddButtonForOtherRules(0, 'FILTERS');
        await botRulesSettings.configFilter('avgmin is not 10', metric1, '~', '10');
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getFilterList(0),
            'TC99032_2',
            'Add rule - 2 filters added'
        );

        await botRulesSettings.editFilterByIndex(0, 1);
        await botRulesSettings.configFilter('modified filter expression', attr1, '=', 'Delta Air Lines Inc.');
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getFilterList(0),
            'TC99032_2',
            'Add rule - Filter modified'
        );

        await botRulesSettings.removeFilterByIndex(0, 1);
        await since('Filter count should be #{expected} after removed, instead got #{actual}')
                .expect(await botRulesSettings.getFilterItemCount(0))
                .toBe(1);
        // save and reopen to check the edit persisted
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');
        await takeScreenshotByElement(
            botRulesSettings.getFilterList(0),
            'TC99032_2',
            'Check saved Filter after reopen'
        );
    });

    it('[TC99032_3] Add Order By rule', async () => {
        await botRulesSettings.addNewRule();
        await botRulesSettings.addBasedOnObjectsBySelection(0, [attr1, metric1]);

        // config order by
        await botRulesSettings.clickAddButtonForOtherRules(0, 'Order By');
        await botRulesSettings.configOrderBy('order by expression', attr1);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.clickAddButtonForOtherRules(0, 'Order By');
        await botRulesSettings.configOrderBy('order by expression 2', metric1, true);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        // drag and drop to change order
        await botRulesSettings.dragAndDropOrderByItem(0, 1, 0);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getOrderByList(0),
            'TC99032_3',
            'Add rule - Order By'
        );
        await botRulesSettings.removeOrderByByIndex(0, 0);
        await since('Order By count should be #{expected} after removed, instead got #{actual}')
                .expect(await botRulesSettings.getOrderByItemCount(0))
                .toBe(1);
        await botRulesSettings.editOrderByByIndex(0, 0);
        await botRulesSettings.configOrderBy('modified order by expression', metric1, true);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getOrderByList(0),
            'TC99032_3',
            'Add rule - Order By edited'
        );

        // save and reopen to check the edit persisted
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');
        await takeScreenshotByElement(
            botRulesSettings.getOrderByList(0),
            'TC99032_3',
            'Check saved Order By after reopen'
        );
    });

    it('[TC99032_4] Add Group By rule', async () => {
        await botRulesSettings.addNewRule();
        await botRulesSettings.addBasedOnObjectsBySelection(0, [attr1, metric1]);
        // config group by
        await botRulesSettings.clickAddButtonForOtherRules(0, 'Group By');
        await botRulesSettings.configGroupBy('group by expression', [attr1, attr2]);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.clickAddButtonForOtherRules(0, 'Group By');
        await botRulesSettings.configGroupBy('group by expression 2', metric1);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        // drag and drop to change order
        await botRulesSettings.dragAndDropGroupByItem(0, 1, 0);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.moveToElement(botRulesSettings.getManageRulesTitle());
        await takeScreenshotByElement(
            botRulesSettings.getGroupByList(0),
            'TC99032_4',
            'Add rule - Group By'
        );
        await botRulesSettings.removeGroupByByIndex(0, 0);
        await since('Group By count should be #{expected} after removed, instead got #{actual}')
                .expect(await botRulesSettings.getGroupByItemCount(0))
                .toBe(1);
        
        // save and reopen to check the edit persisted
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');

        await takeScreenshotByElement(
            botRulesSettings.getGroupByList(0),
            'TC99032_4',
            'Check saved Group By after reopen'
        );
    });

    it('[TC99032_5] Add Configuration of Based On Metrics', async () => {
        await botRulesSettings.addNewRule();
        await botRulesSettings.addBasedOnObjectsBySelection(0, metric1);
        await botRulesSettings.addBasedOnObjectsBySearch(0, metric2);
        // config metric configuration for metric1
        await botRulesSettings.expandBasedOnObjectCollapseArrowByName(0, metric1);
        await botRulesSettings.addBasedOnObjectConfiguration(0, metric1, 'Group By');
        await botRulesSettings.configGroupBy('group by expression', [attr1, attr2, metric1]);
        await botRulesSettings.addBasedOnObjectConfiguration(0, metric1, 'Order By');
        await botRulesSettings.configOrderBy('order by expression', metric1, true);
        await botRulesSettings.addBasedOnObjectConfiguration(0, metric1, 'Filter By');
        await botRulesSettings.configFilter('filter expression', attr1, '~', '100');
        await botRulesSettings.clickManageRulesTitleToExitEdit();

        // config metric configuration for metric2
        await botRulesSettings.expandBasedOnObjectCollapseArrowByName(0, metric2);
        await botRulesSettings.addBasedOnObjectConfiguration(0, metric2, 'Break By');
        await botRulesSettings.selectMultipleObjectsInBasedOnObjectConfigurationDropdown(0, metric2, [attr1, attr2]);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.addBasedOnObjectConfiguration(0, metric2);
        await botRulesSettings.selectMultipleObjectsInBasedOnObjectConfigurationDropdown(0, metric2, [attr1, metric1]);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.addBasedOnObjectConfiguration(0, metric2, 'Forbid With');
        await botRulesSettings.selectMultipleObjectsInBasedOnObjectConfigurationDropdown(0, metric2, metric2);
        await botRulesSettings.clickManageRulesTitleToExitEdit();

        await takeScreenshotByElement(
            botRulesSettings.getBasedOnList(0),
            'TC99032_5',
            'Based On Metric - Configuration added'
        );
        await botRulesSettings.removeBasedOnObjectConfigurationItemByIndex(0, metric2, 1);
        await botRulesSettings.editBasedOnObjectConfigurationItemByIndex(0, metric2, 1, 'Require');
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnConfigurationSection(0, metric2),
            'TC99032_5',
            'Based On Metric - Configuration removed and edited'
        );

        // save and reopen to check the edit persisted
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');

        await botRulesSettings.expandBasedOnObjectCollapseArrowByName(0, metric1);
        await botRulesSettings.expandBasedOnObjectCollapseArrowByName(0, metric2);
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnList(0),
            'TC99032_5',
            'Check saved Based On Metric Configuration after reopen'
        );
    });

    it('[TC99032_6] Advanced Settings', async () => {
        await botRulesSettings.addNewRule();
        // check Advanced Settings before add Based On objects
        await botRulesSettings.expandAdvancedSettings(0);
        await since('Before Based on object added, the add time rule button should be disabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'TIME')).toBe(true);
        await since('Before Based on object added, the add preference rule button should be disabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'PREFERENCES')).toBe(true);
        await since('Before Based on object added, the add guards rule button should be disabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'GUARDS')).toBe(true);
        // add Based On objects and check + buttons again
        await botRulesSettings.addBasedOnObjectsBySelection(0, [attr1, metric1]);
        await since('After Based on object added, the add time rule button should be enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'TIME')).toBe(false);
        await since('After Based on object added, the add preference rule button should be enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'PREFERENCES')).toBe(false);
        await since('After Based on object added, the add guards rule button should be enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'GUARDS')).toBe(false);

        // config Time rule
        await botRulesSettings.clickAddButtonForOtherRules(0, 'TIME');
        await botRulesSettings.configTimeinAdvancedSettings('', attr1, 'US airways');
        await botRulesSettings.clickManageRulesTitleToExitEdit();

        // config Preference rule
        await botRulesSettings.clickAddButtonForOtherRules(0, 'PREFERENCES');
        await botRulesSettings.configPreferenceInAdvancedSettings('', false, metric1, metric2);
        await takeScreenshotByElement(
            botRulesSettings.getGeneralItemEditingContainer(),
            'TC99032_6',
            'Check Advanced Settings editing - Preference'
        );
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.clickAddButtonForOtherRules(0, 'PREFERENCES');
        await botRulesSettings.configPreferenceInAdvancedSettings('', true, attr2);
        await botRulesSettings.clickManageRulesTitleToExitEdit();

        // config Guards rule
        await botRulesSettings.clickAddButtonForOtherRules(0, 'GUARDS');
        await botRulesSettings.configGuardsInAdvancedSettings('guard expression', [attr1, attr2]);
        await botRulesSettings.clickManageRulesTitleToExitEdit();

        await takeScreenshotByElement(
            botRulesSettings.getAdvancedSettingsContent(0),
            'TC99032_6',
            'Check Advanced Settings section'
        );
        // edit and remove items
        await botRulesSettings.editAdvancedSettingsRuleItemByIndex(0, 0, 0);
        await botRulesSettings.configTimeinAdvancedSettings('modified time expression', attr2, 'Books');
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.removeAdvancedSettingsRuleItemByIndex(0, 1, 1);

        // save and reopen to check the edit persisted
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });  
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');
        await botRulesSettings.expandAdvancedSettings(0);
        await takeScreenshotByElement(
            botRulesSettings.getAdvancedSettingsContent(0),
            'TC99032_6',
            'Check saved Advanced Settings after reopen'
        );
    });

    it('[TC99032_7] Add configuration of Based On attributes', async () => {
        await botRulesSettings.addNewRule();
        await botRulesSettings.addBasedOnObjectsBySelection(0, attr1);

        // Break by doesn't exist in attribute configuration
        await botRulesSettings.expandBasedOnObjectCollapseArrowByName(0, attr1);
        await botRulesSettings.clickAddButtonInBasedOnObjectConfiguration(0, attr1);
        await botRulesSettings.clickBasedOnConfigurationActionDropdown(0, attr1);
        await since('menu item break by displayed should be #{expected}, instead got #{actual}')
            .expect(await botRulesSettings.getDropdownOption('Break By').isDisplayed())
            .toBe(false);
        await botRulesSettings.addBasedOnObjectConfiguration(0, attr1, 'Group By');
        await botRulesSettings.configGroupBy('group by expression', [attr1, attr2]);
        await botRulesSettings.addBasedOnObjectConfiguration(0, attr1, 'Order By');
        await botRulesSettings.configOrderBy('order by expression', attr2, true);
        await botRulesSettings.addBasedOnObjectConfiguration(0, attr1, 'Filter By');
        await botRulesSettings.configFilter('filter expression', metric1, '~', '100');
        await botRulesSettings.addBasedOnObjectConfiguration(0, attr1);
        await botRulesSettings.selectMultipleObjectsInBasedOnObjectConfigurationDropdown(0, attr1, [attr1, metric1]);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await botRulesSettings.addBasedOnObjectConfiguration(0, attr1, 'Forbid With');
        await botRulesSettings.selectMultipleObjectsInBasedOnObjectConfigurationDropdown(0, attr1, metric1);
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnConfigurationSection(0, attr1),
            'TC99032_7',
            'Based On Attribute - Configuration removed and edited'
        );

        // save and reopen to check the edit persisted
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: bot_sql_template.projectId, botId: bot_sql_template.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Rule');

        await botRulesSettings.expandBasedOnObjectCollapseArrowByName(0, attr1);
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnList(0),
            'TC99032_7',
            'Check saved Based On Attribute Configuration after reopen'
        );
    });

    it('[TC99032_8] Select All objects in Based On configuration', async () => {
        await botRulesSettings.addNewRule();
        await botRulesSettings.addBasedOnObjectsSelectingAll(0);
        // selected all objects and count should display as X/X
        await since('Based On object count should be #{expected}, instead got #{actual}')
            .expect(await botRulesSettings.getBasedOnSelectCount(0))
            .toBe('19 / 19 selected');
        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnList(0),
            'TC99032_8',
            'Based On - Select All objects only'
        );
        
        await since('All Objects added, the add filter by button should be Enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'FILTERS')).toBe(false);
        await since('All Objects added, the add order by button should be Enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'Order By')).toBe(false);
        await since('All Objects added, the add group by button should be Enabled')
            .expect(await botRulesSettings.isAddButtonForOtherRulesDisabled(0, 'Group By')).toBe(false);

        // add recent edit object
        await botRulesSettings.addRecentlyEditedObjectsWithAllObjectsSelected(0, attr1);
        await botRulesSettings.openBasedOnDropdown(0);
        await since('Edit icon present for Based On dropdown item should be #{expected}, instead got #{actual}')
            .expect(await botRulesSettings.isEditIconPresentForBasedOnDropdown(attr1))
            .toBe(false);
        await botRulesSettings.closeBasedOnDropdown(0);
        await botRulesSettings.openBasedOnDropdown(0);
        await since('Edit icon present for Based On dropdown item already added should be #{expected}, instead got #{actual}')
            .expect(await botRulesSettings.isEditIconPresentForBasedOnDropdown(metric1))
            .toBe(true);

        await botRulesSettings.clickManageRulesTitleToExitEdit();
        await takeScreenshotByElement(
            botRulesSettings.getBasedOnList(0),
            'TC99032_8',
            'Based On - Select All objects + 1 recently edited'
        );

        // remove "All Objects Selected"
        await botRulesSettings.removeAllObjectsSelected(0);
        await since('Based On object count should be #{expected} after remove All Objects, instead got #{actual}')
            .expect(await botRulesSettings.getBasedOnSelectCount(0))
            .toBe('1 / 19 selected');
        await since('All objects Selected removed, the label exists should be #{expected}, instead got #{actual}')
            .expect(await botRulesSettings.getBasedOnAllObjectLabel(0).isExisting())
            .toBe(false);
        await since('After All objects Selected removed, Recently Edited string exists should be #{expected}, instead got #{actual}')
            .expect(await botRulesSettings.getRecentlyEditedLabel(0).isExisting())
            .toBe(false);

        await botRulesSettings.addBasedOnObjectsSelectingAll(0);
        await since('Based On object count should be #{expected} after add All Objects again, instead got #{actual}')
            .expect(await botRulesSettings.getBasedOnSelectCount(0))
            .toBe('19 / 19 selected');
        await takeScreenshotByElement(
            botRulesSettings.getDropdown(),
            'TC99032_8',
            'Based On - Dropdown with all objects selected'
        );

        // click any item to change back to default view
        await botRulesSettings.clickItemInDropdown(attr1);
        await takeScreenshotByElement(
            botRulesSettings.getDropdown(),
            'TC99032_8',
            'Based On - Dropdown with normal view'
        );         
        await since('After click item in dropdown, Recently Edited string exists should be #{expected}, instead got #{actual}')
            .expect(await botRulesSettings.getRecentlyEditedLabel(0).isExisting())
            .toBe(false);
    });
});
