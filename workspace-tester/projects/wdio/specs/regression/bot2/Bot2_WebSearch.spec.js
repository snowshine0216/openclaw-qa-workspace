import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Bot 2.0 Web Search', () => {
    const { loginPage, libraryPage, aibotChatPanel, bot2Chat, botAuthoring, botCustomInstructions } = browsers.pageObj1;
    const aibot_mtdi = {
        id: 'D0DFE38411BF4309AB70B54C653CAD6D',
        name: 'AUTO_WebSearch_MTDI',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_mosaic = {
        id: '0CD016A91ADF40CCA919E1064115891F',
        name: 'AUTO_WebSearch_Mosaic',
        projectId: bot.project_applicationTeam.id,
    };
    const aibot_universal = {
        id: '25E8B304E9D64BD78E9282378E598E52',
        name: 'AUTO_WebSearch_Universal',
        projectId: bot.project_applicationTeam.id,
    };
    const generalSettings = botAuthoring.generalSettings;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.webSearchUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {});

    afterAll(async () => {});

    it('[TC99032_01] Web Search - Turn On/Off web search setting', async () => {
        await libraryPage.editBotByUrl({ projectId: aibot_mtdi.projectId, botId: aibot_mtdi.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await botAuthoring.selectBotConfigTabByName('General');

        // prepare: turn OFF web search
        await generalSettings.turnOffWebSearch();
        await since('By default Web research button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWebSearchDisplayed())
            .toBe(false);

        // turn on web search
        await generalSettings.turnOnWebSearch();
        await generalSettings.saveConfig();
        await since('turn on and web search button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWebSearchDisplayed())
            .toBe(true);
        await takeScreenshotByElement(await aibotChatPanel.getRelatedSuggestionArea(), 'TC99032_01', 'GallerayPanel');

        // enable web search
        await aibotChatPanel.enableWebSearch();
        await since('enable web search and the enable status is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWebSearchEnabled())
            .toBe(true);

        // turn off web search
        await generalSettings.turnOffWebSearch();
        await generalSettings.saveConfig();
        await since('enable but turn off, button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWebSearchDisplayed())
            .toBe(false);
        await generalSettings.turnOnWebSearch();
        await since('turn on again and button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWebSearchDisplayed())
            .toBe(true);
        await since('turn on again and button enable is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWebSearchEnabled())
            .toBe(false);
    });

    it('[TC99032_02] Web Search - Configure allowlist and block list', async () => {
        await libraryPage.editBotByUrl({ projectId: aibot_mtdi.projectId, botId: aibot_mtdi.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // turn Off web search
        await botAuthoring.selectBotConfigTabByName('General');
        await generalSettings.turnOffWebSearch();
        await since('By default Web research button present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWebSearchDisplayed())
            .toBe(false);
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since(
            'turn off web search and management setting present is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isWebManagementDisplayed())
            .toBe(false);

        // turn on web search and web management
        await botAuthoring.selectBotConfigTabByName('General');
        await generalSettings.turnOnWebSearch();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since(
            'turn on web search and management setting present is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.isWebManagementDisplayed())
            .toBe(true);
        await botCustomInstructions.turnOnWebManagement();
        await botCustomInstructions.deleteAllDomains();
        await botAuthoring.saveExistingBotV2();
        await takeScreenshotByElement(
            await botCustomInstructions.getWebManagementSetting(),
            'TC99032_02',
            'WebManagementSetting_On'
        );

        // at most 5 allow list
        await botCustomInstructions.addAllowlistDomain('example1.com');
        await botCustomInstructions.addAllowlistDomain('example2.com');
        await botCustomInstructions.addAllowlistDomain('example3.com');
        await botCustomInstructions.addAllowlistDomain('example4.com');
        await since('Add 4 allow list domain and add button should be enabled')
            .expect(await botCustomInstructions.isAddBtnOnAllowlistDisabled())
            .toBe(false);
        await botCustomInstructions.addAllowlistDomain('example5.com');
        await since('Add 5 allow list domains and add button should be disabled')
            .expect(await botCustomInstructions.isAddBtnOnAllowlistDisabled())
            .toBe(true);

        // save and check
        await botAuthoring.saveExistingBotV2();
        await since('Save agent and the allow list count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getAllowlistItemCount())
            .toBe(5);
        await aibotChatPanel.goToLibrary();
    });

    it('[TC99032_03] Web Search - Different kinds of valid and invalid domains', async () => {
        await libraryPage.editBotByUrl({ projectId: aibot_mosaic.projectId, botId: aibot_mosaic.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // turn on web search and web management
        await botAuthoring.selectBotConfigTabByName('General');
        await generalSettings.turnOnWebSearch();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botCustomInstructions.turnOnWebManagement();

        // valid: domain
        await botCustomInstructions.addAllowlistDomain('google.com');
        await botCustomInstructions.addAllowlistDomain('www.google.com');
        await botCustomInstructions.addAllowlistDomain('microstrategy.atlassian.net');
        await botCustomInstructions.addBlocklistDomain('example123.com');
        await botCustomInstructions.addBlocklistDomain('192.168.1.1');
        await since(
            'Valid case and the allow list error count is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.getAllowlistErrorMessageCount())
            .toBe(0);
        await since(
            'Valid case and the block list error count is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.getBlocklistErrorMessageCount())
            .toBe(0);
        await botAuthoring.saveExistingBotV2();
        await since('Valid case and allow list count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getAllowlistItemCount())
            .toBe(3);
        await since('Valid case and block list count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getBlocklistItemCount())
            .toBe(2);
        await botCustomInstructions.deleteAllDomains();

        // invalid: special chars
        await botCustomInstructions.addAllowlistDomain('google*.com');
        await botCustomInstructions.addAllowlistDomain('https://example.com');
        await botCustomInstructions.addBlocklistDomain('example.com/path');
        await botCustomInstructions.addBlocklistDomain('localhost');
        await botCustomInstructions.addBlocklistDomain('example..com');
        await since(
            'Invalid case and the allow list error count is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.getAllowlistErrorMessageCount())
            .toBe(2);
        await since(
            'Invalid case and the block list error count is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await botCustomInstructions.getBlocklistErrorMessageCount())
            .toBe(3);
        await botAuthoring.saveExistingBotV2();
        await libraryPage.refresh();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Valid case and allow list count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getAllowlistItemCount())
            .toBe(0);
        await since('Valid case and block list count is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.getBlocklistItemCount())
            .toBe(0);
        await botCustomInstructions.deleteAllDomains();
    });

    it('[TC99032_04] Web Search - Q&A when enable web search', async () => {});

    it('[TC99032_05] Web Search - Q&A with allow list and block list respectively', async () => {});

    it('[TC99032_06] Web Search - Q&A on universal bot', async () => {});
});
