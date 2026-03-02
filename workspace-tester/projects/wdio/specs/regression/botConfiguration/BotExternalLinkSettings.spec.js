import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow, aibotMediumWindow } from '../../../constants/index.js';
import { configBotUser, getBotObjectInfo, getPublishInfo, botSettings } from '../../../constants/bot.js';

describe('AI Bot External Links on Authoring', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring, aibotChatPanel } = browsers.pageObj1;
    let botId;
    const botIdsToDelete = [];
    const botName = 'TC91749 Bot External Link Test';
    const BotToCreate = getBotObjectInfo({ botName });

    const externalLinks = [
        {
            iconIndex: 5,
            url: 'https://www.baidu.com/',
            title: 'Baidu',
        },
        {
            iconIndex: 3,
            url: 'https://www.microstrategy.com/en',
            title: 'MSTR',
        },
        {
            iconIndex: 4,
            url: 'https://www.google.com/',
            title: 'Google',
        },
    ];

    beforeAll(async () => {
        await loginPage.login(configBotUser);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: configBotUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        const publishInfo = getPublishInfo({ botId, projectId: BotToCreate.project.id });
        await publishBotByAPI({
            credentials: configBotUser,
            publishInfo: publishInfo,
        });
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: configBotUser,
            botList: [...botIdsToDelete],
            projectId: BotToCreate.project.id,
        });
        botIdsToDelete.length = 0;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    //TC91749: [Chatbot] [General Settings] Verify Bot external links in general tab
    it('[TC91749_01] verify external link', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.clickAddLinkButton();
        await since('Default external link display format should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkDisplayFormatSelection().getText())
            .toBe('Text only');
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_01_01',
            'default external link in chat title bar'
        );
        await botAuthoring.generalSettings.selectLinkDisplayFormat('Icon + text');
        await since('External link display format should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkDisplayFormatSelection().getText())
            .toBe('Icon + text');

        await botAuthoring.generalSettings.setExternalLinkByIndex(externalLinks[0]);
        await botAuthoring.generalSettings.addExternalLink(externalLinks[1]);
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getQuestionInputSection(),
            'TC91749_01_02',
            'Add two external links'
        );
        await botAuthoring.aibotChatPanel.openExternalLinkOnChatTitleBarByIndex(0);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(externalLinks[0].url);
        await aibotChatPanel.closeTab(1);
    });

    it('[TC91749_02] delete external link', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        for (const link of externalLinks) {
            await botAuthoring.generalSettings.addExternalLink(link);
        }
        await since('Total external links should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkItems().length)
            .toBe(3);
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(1);
        await since('Total external links should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkItems().length)
            .toBe(2);
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(1);
        await since('Total external links should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkItems().length)
            .toBe(1);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.generalSettings.scrollToBottom();
        await since('Total external links should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkItems().length)
            .toBe(1);
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_02_01',
            'Three links and remove two'
        );
        await botAuthoring.aibotChatPanel.openExternalLinkOnChatTitleBarByIndex(0);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(externalLinks[0].url);
        await aibotChatPanel.closeTab(1);
    });

    it('[TC91749_03] update link', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        for (const link of externalLinks) {
            await botAuthoring.generalSettings.addExternalLink(link);
        }
        await botAuthoring.generalSettings.setExternalLinkByIndex(externalLinks[0], 1);
        await botAuthoring.generalSettings.setExternalLinkByIndex(externalLinks[0], 2);
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_03_01',
            'Three links with same contents'
        );
    });

    it('[TC91749_04] verify link display format', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.clickAddLinkButton();
        await botAuthoring.generalSettings.addExternalLink(externalLinks[0]);
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_04_01',
            'display links by text only'
        );
        await botAuthoring.generalSettings.selectLinkDisplayFormat('Icon + text');
        await since('External link display format should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkDisplayFormatSelection().getText())
            .toBe('Icon + text');
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_04_02',
            'display links by Icon + text'
        );
        await botAuthoring.generalSettings.selectLinkDisplayFormat('Icon only');
        await since('External link display format should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkDisplayFormatSelection().getText())
            .toBe('Icon only');
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_04_03',
            'display links by Icon only'
        );
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_04_04',
            'display links by Icon only in consumption'
        );
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.scrollToBottom();
        await since('External link display format should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getLinkDisplayFormatSelection().getText())
            .toBe('Icon only');
    });

    it('[TC91749_05] invalid external links', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.addExternalLink({
            iconIndex: 3,
            url: '',
            title: '',
        });
        await takeScreenshotByElement(botAuthoring.generalSettings.getLinkSection(), 'TC91749_05_01', 'empty link url');
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.generalSettings.scrollToBottom();
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getLinkSection(),
            'TC91749_05_02',
            'Reopen bot with invalid link url'
        );

        await botAuthoring.generalSettings.setExternalLinkByIndex({
            iconIndex: 5,
            url: 'google.com',
            title: 'url title with long string with long string with long string',
        });
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getLinkSection(),
            'TC91749_05_03',
            'Invalid link url prefix'
        );
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_05_04',
            'Invalid link url in chat title'
        );
        await botAuthoring.generalSettings.hoverOnInvalidUrlIconByIndex();
        await since('Warning message of invalid url should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTooltipDisplayedText())
            .toBe(botSettings.linkUrlInvalidErrorMessage);
        await botAuthoring.saveBot({});
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await takeScreenshotByElement(
            aibotChatPanel.getTitleBarExternalLinkContainer(),
            'TC91749_05_04',
            'Invalid link url'
        );
    });

    it('[TC91749_06] external link tooltip', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.openLinkSettingsTooltip();
        await since('External link display format should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTooltipDisplayedText())
            .toBe(botSettings.linkSettingsTooltipText);
        await since('External link display format should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTooltipFullText())
            .toBe(botSettings.linkSettingsTooltipText);
    });

    it('[TC91749_07] external links in responsive view', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        for (const link of externalLinks) {
            await botAuthoring.generalSettings.addExternalLink(link);
        }
        await since(
            `External link popup menu should not display under resolution ${browserWindow}, instead it is shown.`
        )
            .expect(await botAuthoring.aibotChatPanel.getLinksPopoverButton().isDisplayed())
            .toBe(false);
        await setWindowSize(aibotMediumWindow);
        await since(
            `External link popup menu should display under resolution ${aibotMediumWindow}, instead it is not shown.`
        )
            .expect(await botAuthoring.aibotChatPanel.getLinksPopoverButton().isDisplayed())
            .toBe(true);
        await botAuthoring.aibotChatPanel.clickLinksPopoverButton();
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getLinksPopoverContents(),
            'TC91749_07_01',
            'Text only in responsive view'
        );
        await botAuthoring.generalSettings.selectLinkDisplayFormat('Icon only');
        await botAuthoring.aibotChatPanel.clickLinksPopoverButton();
        await takeScreenshotByElement(
            botAuthoring.aibotChatPanel.getLinksPopoverContents(),
            'TC91749_07_02',
            'Icon only in responsive view'
        );
    });

    it('[TC91749_08] open external links in responsive view', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        for (const link of externalLinks) {
            await botAuthoring.generalSettings.addExternalLink(link);
        }
        await setWindowSize(aibotMediumWindow);
        await botAuthoring.aibotChatPanel.clickLinksPopoverButton();
        await botAuthoring.aibotChatPanel.clickLinksPopoverItemsbyIndex(0);
        await botAuthoring.aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.aibotChatPanel.currentURL())
            .toBe(externalLinks[0].url);
        await botAuthoring.closeTab(1);
    });

    it('[TC91749_09] resize settings panel', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC91749_09_01',
            'General settings tab before resize'
        );
        await botAuthoring.aibotChatPanel.resizeConfigurationPanel();
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC91749_09_02',
            'General settings tab after resize panel width'
        );
    });
});
