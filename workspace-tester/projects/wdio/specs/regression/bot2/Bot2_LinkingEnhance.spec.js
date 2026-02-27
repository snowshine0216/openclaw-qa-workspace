import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { botUser3 } from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Bot 2.0 Attribute Linking Enhancement', () => {
    const { loginPage, libraryPage, aibotChatPanel, aibotDatasetPanel, libraryAuthoringPage, botAuthoring } = browsers.pageObj1;
    const bot_linking_mtdi = {
        id: '8920241889EA4DCA865D5F5B4C31EEC0',
        name: 'AUTO_BOT_Linking_MTDI',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };
    const bot_linking_olap = {
        id: '7D4C6AAFFC5D40998F25B2537A177B4C',
        name: 'AUTO_BOT_Linking_OLAP',
        projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botUser3);
        await libraryPage.waitForLibraryLoading();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99025_5] MTDI linked', async () => {
        const dataset1 = 'AUTO_OfficeForecast_MTDI';
        const attribute1 = 'Category_rename';
        const dataset2 = 'AUTO_OfficeSales_MTDI';
        const attribute2 = 'Category';
        const attribute = 'Account';
        const alias1 = 'Acc.';
        const alias2 = 'Cat.';

        await libraryPage.editBotByUrl({ projectId: bot_linking_mtdi.projectId, botId: bot_linking_mtdi.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        // check link icon in dataset panel
        await aibotDatasetPanel.toggleShowDescription();
        since('link icon should show for Account in dataset1')
        .expect(await aibotDatasetPanel.isLinkIconDisplayedOfObject(dataset1, attribute)).toBe(true);
        since('link icon should show for Account in dataset2')
        .expect(await aibotDatasetPanel.isLinkIconDisplayedOfObject(dataset2, attribute)).toBe(true);
        since('link icon should show for Category_rename in dataset1')
        .expect(await aibotDatasetPanel.isLinkIconDisplayedOfObject(dataset1, attribute1)).toBe(true);
        since('link icon should show for Category in dataset2')
        .expect(await aibotDatasetPanel.isLinkIconDisplayedOfObject(dataset2, attribute2)).toBe(true);

        // add column alias
        await aibotDatasetPanel.createColumnAlias(dataset1, attribute, alias1);
        since('add alias Acc. in dataset1, it should show for linked attribute Account in dataset2')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset2, attribute, alias1)).toBe(true);
        await aibotDatasetPanel.deleteColumnAlias(dataset2, attribute, alias1);
        since('deleted alias from dataset1, alias should not show in dataset1')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset1, attribute, alias1)).toBe(false);

        await aibotDatasetPanel.createColumnAlias(dataset1, attribute1, alias2);
        since('add alias Cat. in dataset1, it should show for linked attribute Category in dataset2')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset2, attribute2, alias2)).toBe(true);

        // check ask about panel
        await aibotChatPanel.openAskAboutPanel();
        await aibotChatPanel.expandAskAboutObjectByName(attribute2);
        since('alias in ask about panel for Category in dataset2 dispalyed should be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isAliasDispalyedForAskAboutObject(attribute2, alias2)).toBe(true);
        await aibotChatPanel.expandAskAboutObjectByName(attribute1);
        since('alias in ask about panel for Category in dataset1 dispalyed should be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isAliasDispalyedForAskAboutObject(attribute1, alias2)).toBe(true);

        // enable NER
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(dataset2, attribute2);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Enable');
        since('NER enabled for Category in dataset2 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset2, attribute2)).toBe(true);
        since('NER enabled for Category_rename in dataset1 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset1, attribute1)).toBe(true);

        // disable NER
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(dataset1, attribute1);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Disable');
        since('NER enabled for Category_rename in dataset1 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset1, attribute1)).toBe(false);
        since('NER enabled for Category in dataset2 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset2, attribute2)).toBe(false);
        
        await libraryPage.clickLibraryIcon();
    });

    it('[TC99025_6] OLAP Linked ', async () => {
        const dataset1 = 'AUTO_OLAP';
        const dataset2 = 'AUTO_Airline_MTDI (Year map)';
        const dataset3 = 'AUTO_Product_OLAP';
        const attribute = 'Year';
        const alias1 = 'Yr';
        const alias2 = 'Yearly';
        const attributeNER = 'Subcategory (DESC)'

        await libraryPage.editBotByUrl({ projectId: bot_linking_olap.projectId, botId: bot_linking_olap.id });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');

        // check link icon in dataset panel
        await aibotDatasetPanel.toggleShowDescription();
        since('link icon should show for Year in dataset1')
        .expect(await aibotDatasetPanel.isLinkIconDisplayedOfObject(dataset1, attribute)).toBe(true);
        since('link icon should show for Year in dataset2')
        .expect(await aibotDatasetPanel.isLinkIconDisplayedOfObject(dataset2, attribute)).toBe(true);
        since('link icon should show for Year in dataset3')
        .expect(await aibotDatasetPanel.isLinkIconDisplayedOfObject(dataset3, attribute)).toBe(true);

        // add column alias
        // add alias Yr for year in dataset1
        await aibotDatasetPanel.createColumnAlias(dataset1, attribute, alias1);
        since('add alias Yr for year in dataset1, it should show for linked attribute year in dataset2')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset2, attribute, alias1)).toBe(true);
        since('add alias Yr for year in dataset1, it should show for linked attribute year in dataset3')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset3, attribute, alias1)).toBe(true); 

        // add alias Yearly for year in dataset2
        await aibotDatasetPanel.createColumnAlias(dataset2, attribute, alias2);
        since('add alias Yearly for year in dataset2, it should show for linked attribute year in dataset1')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset2, attribute, alias2)).toBe(true);
        since('add alias Yearly for year in dataset1, it should show for linked attribute year in dataset3')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset3, attribute, alias2)).toBe(true); 

        // check ask about panel
        await aibotChatPanel.openAskAboutPanel();
        await aibotChatPanel.expandAskAboutObjectByName(attribute);
        since('alias Yr in ask about panel for Year dispalyed should be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isAliasDispalyedForAskAboutObject(attribute, alias1)).toBe(true);
        since('alias Yearly in ask about panel for Year dispalyed should be #{expected}, instead we have #{actual}')
        .expect(await aibotChatPanel.isAliasDispalyedForAskAboutObject(attribute, alias2)).toBe(true);

        // delete alias Yr in dataset3
        await aibotDatasetPanel.deleteColumnAlias(dataset3, attribute, alias1);
        await aibotDatasetPanel.deleteColumnAlias(dataset3, attribute, alias2);
        since('deleted alias Yr from dataset3, alias should not show in dataset1')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset1, attribute, alias1)).toBe(false);
        since('deleted alias Yr from dataset3, alias should not show in dataset2')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset2, attribute, alias1)).toBe(false);
        since('deleted alias Yearly from dataset3, alias should not show in dataset1')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset1, attribute, alias2)).toBe(false);
        since('deleted alias Yearly from dataset3, alias should not show in dataset2')
        .expect(await aibotDatasetPanel.isColumnAliasDisplayed(dataset2, attribute, alias2)).toBe(false);

        // enable NER
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(dataset1, attributeNER);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Enable');
        since('NER enabled for Subcategory in dataset1 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset1, attributeNER)).toBe(true);
        since('NER enabled for Subcategory in dataset3 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset3, attributeNER)).toBe(true);

        // disable NER
        await aibotDatasetPanel.openDatasetObjectContextMenuV2(dataset3, attributeNER);
        await aibotDatasetPanel.clickDatasetObjectContextMenu('NER', 'Disable');
        since('Disable NER, NER enable status for Subcategory in dataset1 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset1, attributeNER)).toBe(false);
        since('Disable NER, NER enabled status for Subcategory in dataset3 should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isNerEnabledForObject(dataset3, attributeNER)).toBe(false);

        await libraryPage.clickLibraryIcon();
    });

});
