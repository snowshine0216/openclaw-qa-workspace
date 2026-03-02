import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Bot 2.0 Bot1 Deprecation', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    
    const bot1CreateInfo = {
        name: 'Bot1.0 create',
        id: '1FF9807EFA413DAE4019E3B167156013'
    };

    const deprecatedMsg = 'This bot has been deprecated and is no longer supported.';
    
    let {
        loginPage,
        libraryPage,
        libraryFilter,
        aibotChatPanel,
        dossierPage,
        botConsumptionFrame,
        libraryAuthoringPage,
        botAuthoring,
        aibotDatasetPanel,
        share,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botUser3);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.waitForLibraryLoading();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99031_1] Bot1.0 is deprecated in library home', async () => {
        // Step 1: Select Bot 1 only in home
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Type');
        await libraryFilter.selectFilterDetailsPanelItem('Bot');
        await libraryFilter.clickApplyButton();
        
        // Step 2: Expect the dossier called "Bot1.0 create" exist
        await since(`Dossier "${bot1CreateInfo.name}" should exist in the filtered results`)
            .expect(await libraryPage.isDossierPresent(bot1CreateInfo.name))
            .toBe(true);
        
        // Step 3: Expect the dossier called "Bot1.0 create" is inactive
        await since(`Dossier "${bot1CreateInfo.name}" should be inactive`)
            .expect(await libraryPage.isDossierInactive(bot1CreateInfo.name))
            .toBe(true);
        
        // Step 4: Check Deprecated string exist
        await since(`Dossier "${bot1CreateInfo.name}" should have "(Deprecated)" text`)
            .expect(await libraryPage.isDossierDeprecated(bot1CreateInfo.name))
            .toBe(true);
        
        // Step 5: Check Dossier icon is gray (grayscale)
        await since(`Dossier "${bot1CreateInfo.name}" icon should be grayscale`)
            .expect(await libraryPage.isDossierIconGrayscale(bot1CreateInfo.name))
            .toBe(true);


        // Clear filters
        await libraryFilter.clearAllFilters();
        await libraryPage.waitForLibraryLoading();
    });
    
    it('[TC99031_2] Bot1.0 is deprecated in consumption mode', async () => {
        // Step 1: Open the Bot1.0 and wait for banner displayed
        await libraryPage.openBotById({
            projectId: project.id,
            botId: bot1CreateInfo.id,
        });
        await dossierPage.waitForDossierLoading();
        await botConsumptionFrame.waitForElementVisible(botConsumptionFrame.getInactiveBanner())
        
        // Step 2: Check banner exist and verify text
        await since('Deprecation banner should exist')
            .expect(await botConsumptionFrame.isInactiveBannerDisplayed())
            .toBe(true);

        await since('Deprecation banner should contain expected text')
            .expect(await botConsumptionFrame.getInactiveBannerText())
            .toBe(deprecatedMsg);
        
        // Step 3: Check input box is disabled
        await since('Chat input box should be disabled')
            .expect(await aibotChatPanel.isDisabledInputContainerDisplayed())
            .toBe(true);

        await since('Send button should be disabled')
            .expect(await aibotChatPanel.isDisabledSendIconDisplayed())
            .toBe(true);

        await since('Deprecated placeholder text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(deprecatedMsg);
            
        // Step 4: Check topic suggestion is disabled
        await since('Topic suggestions should be disabled')
            .expect(await aibotChatPanel.areTopicSuggestionsDisabled())
            .toBe(true);
        
        // Step 5: Ask about Panel, Snapshot panel, Delete History buttons are disabled
        await since('Ask about panel button should be disabled')
            .expect(await aibotChatPanel.isButtonDisabled(aibotChatPanel.getAskAboutBtn()))
            .toBe(true);
        await since('Snapshot panel button should be disabled')
            .expect(await aibotChatPanel.isButtonDisabled(aibotChatPanel.getOpenSnapshotPanelButton()))
            .toBe(true);
        await since('Clear history button should be disabled')
            .expect(await aibotChatPanel.isButtonDisabled(aibotChatPanel.getClearHistoryButton()))
            .toBe(true);
        // go back to library home
        await aibotChatPanel.goToLibrary();
    });

    it('[TC99031_3] Bot1.0 is deprecated in edit mode', async () => {
        // Step 1: Open the Bot1.0 in edit mode
        await libraryPage.editBotByUrl({
            projectId: project.id,
            botId: bot1CreateInfo.id,
        });
        await libraryAuthoringPage.waitForCurtainDisappear();
        await since('Deprecation banner should exist')
            .expect(await botAuthoring.isInActiveBannerDisplayed())
            .toBe(true);

        await since('Deprecation banner should contain expected text')
            .expect(await botAuthoring.getInactiveBannerText())
            .toBe(deprecatedMsg);

        // Step 2: modify bot name but cannot save
        await botAuthoring.generalSettings.changeBotName(`${bot1CreateInfo.name}_edited`);
        await since('Save button should be disabled')
            .expect(await botAuthoring.isSaveButtonEnabled())
            .toBe(false);

        // Step 3: Check Data tab - cannot enter advanced mode
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Advanced button enabled should be #{expected}, instead we have #{actual}')
        .expect(await aibotDatasetPanel.isAdvancedButtonEnabled())
        .toBe(false);

        // Step 4: Check Share menu
        await share.openSharePanel();
        await since('Item of share bot in share panel should exist')
            .expect(await share.isSharePanelItemExisted('Share Bot'))
            .toBe(true);
        await since('Item of Embed Bot in share panel should exist')
            .expect(await share.isSharePanelItemExisted('Embed Bot'))
            .toBe(true);
        await share.closeSharePanel();

        // go back to library home
        await aibotChatPanel.goToLibrary();
    });
});