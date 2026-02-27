import { aibot599pxWindow, aibot600pxWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { getBotConfigurationObject, consumptionResponsiveBotUser } from '../../../constants/bot.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { getBotAsHomeCustomAppObjByBotId } from '../../../constants/customApp/info.js';

describe('BotConsumptionFrameResponse', () => {
    const aibots = {
        botDisableSnapshot: {
            id: '086792A1B8465E50D606BA943A74FE22',
            name: 'Responsive View Auto - Disable Topic Snapshot And Link',
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
        botEnableSnapshot: {
            id: 'E6C2DD0CD443A9DB654444B8414424BA',
            name: 'Responsive View Auto - Enable Topic Snapshot And Link',
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
    };

    const BotToCreate = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
        configuration: getBotConfigurationObject({
            active: true,
            enableSnapshot: false,
            enableQuestionSuggestions: true,
            enableTopics: false,
            enableInterpretation: false,
            coverImageUrl: 'ai-industry/Sports.jpg',
        }),
        data: {
            datasets: [
                {
                    id: '2F4F0B6753429DF701EB65AA27B63068',
                    name: 'byd_balance_ds_en', //02_Users > xuyin > byd_balance_ds_en
                },
            ],
            isBot: true,
            overwrite: true,
            name: 'Responsive View Auto - Switch Mode Bot',
            description: '',
            folderId: 'D3C7D461F69C4610AA6BAA5EF51F4125', //Tutorial > Public Objects > Reports
        },
    };

    const publishInfo = {
        type: 'document_definition',
        recipients: [
            {
                id: 'AED1016B8B4080D7CD3937BE15FC6E14',
            },
        ],
        projectId: BotToCreate.project.id,
    };

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

    let botId;
    let customAppIdOfBotAsHome;

    let {
        loginPage,
        libraryPage,
        botConsumptionFrame,
        aibotChatPanel,
        botAuthoring,
        libraryAuthoringPage,
        aibotSnapshotsPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consumptionResponsiveBotUser);
    });

    afterEach(async () => {
        botId &&
            (await deleteBotList({
                credentials: consumptionResponsiveBotUser,
                botList: [botId],
            }));
        botId = null;
        customAppIdOfBotAsHome &&
            (await deleteCustomAppList({
                credentials: consumptionResponsiveBotUser,
                customAppIdList: [customAppIdOfBotAsHome],
            }));
        customAppIdOfBotAsHome = null;
    });

    it('[TC97280_1] responsive view of consumption mode in library list app', async () => {
        //Open disable snapshot and no link bot, 599px
        await setWindowSize(aibot599pxWindow);
        await libraryPage.openBotById({
            projectId: aibots.botDisableSnapshot.projectId,
            botId: aibots.botDisableSnapshot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        //Clear history if any
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.clearMobileViewHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        // check toolbar
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC97280_1_01',
            'bot consumption toolbar 599px'
        );
        // check title bar in bot is not displayed
        await since('The title bar status in bot should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTitleBarDisplayed())
            .toBe(false);
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_1_02',
            'check hamburger menu for disable snapshot and no link 599px'
        );
        await aibotChatPanel.closeMobileHamburger();
        //Ask question
        await botAuthoring.aibotChatPanel.askQuestion('Show me Revenue break by Category in bar chart.');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTextAnswerByIndex(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        //Open humburger menu and clear history
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_1_03',
            'check hamburger menu for clear history 599px'
        );
        await aibotChatPanel.clearMobileViewHistory();
        //Resize the window to 600px
        await setWindowSize(aibot600pxWindow);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC97280_1_04',
            'bot consumption toolbar 600px'
        );
        await takeScreenshotByElement(aibotChatPanel.getTitleBar(), 'TC97280_1_05', 'bot consumption title bar 600px');
        //Open enable snapshot and with link bot 599px
        await setWindowSize(aibot599pxWindow);
        await libraryPage.openBotById({
            projectId: aibots.botEnableSnapshot.projectId,
            botId: aibots.botEnableSnapshot.id,
        });
        await libraryAuthoringPage.waitForCurtainDisappear();
        //Clear history if any
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.clearMobileViewHistory();
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_1_05',
            'check hamburger menu for enable snapshot and with link 599px'
        );
        //Open snapshot
        await aibotChatPanel.openMobileViewSnapshotPanel();
        //Delete snapshot if any
        if (await aibotSnapshotsPanel.isClearSnapshotButtonDisplayed()) {
            await aibotSnapshotsPanel.clickClearSnapshots();
            await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        }
        await takeScreenshot('TC97280_1_06', 'open empty snapshot 599px');
        //Close snapshot panel
        await aibotChatPanel.closeMobileViewSnapshotPanel();
        //Open ask about panel
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.openMobileViewAskAboutPanel();
        await takeScreenshot('TC97280_1_07', 'open ask about 599px');
        //Close ask about panel
        await aibotChatPanel.closeMobileViewAskAboutPanel();
        //Ask question
        await botAuthoring.aibotChatPanel.askQuestion('Show me Revenue break by Category in bar chart.');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTextAnswerByIndex(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        //Add to snapshot
        await aibotChatPanel.hoverChatAnswertoAddSnapshotbyIndex(0);
        await aibotChatPanel.waitForElementAppearAndGone(aibotChatPanel.getSnapshotAddedSuccessToast());
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        //Open snapshot
        await aibotChatPanel.openMobileViewSnapshotPanel();
        await since('Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(1);
        //Delete snapshot if any
        if (await aibotSnapshotsPanel.isClearSnapshotButtonDisplayed()) {
            await aibotSnapshotsPanel.clickClearSnapshots();
            await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        }
        //Close snapshot panel
        await aibotChatPanel.closeMobileViewSnapshotPanel();
        //Click link
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.clickMobileViewLinksButton();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileViewLinksContainer(),
            'TC97280_1_08',
            'open link menu 599px'
        );
        await aibotChatPanel.clickMobileViewLinksItemsbyIndex(0);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(externalLinks[0].url);
        await aibotChatPanel.switchToTab(0);
        await aibotChatPanel.closeTab(1);
        //Resize the window to 600px
        await setWindowSize(aibot600pxWindow);
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC97280_1_09',
            'bot consumption toolbar 600px'
        );
        await takeScreenshotByElement(aibotChatPanel.getTitleBar(), 'TC97280_1_10', 'bot consumption title bar 600px');
    });

    it('[TC97280_2] responsive view of consumption mode in bot home app', async () => {
        //Create bot
        botId = await createBotByAPI({ credentials: consumptionResponsiveBotUser, botInfo: BotToCreate });
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consumptionResponsiveBotUser,
            publishInfo: publishInfo,
        });
        //Create bot as home app
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: consumptionResponsiveBotUser,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        //Open disable snapshot, ask about and no link bot, 599px
        await setWindowSize(aibot599pxWindow);
        await libraryPage.openBotById({
            projectId: BotToCreate.project.id,
            botId: botId,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        // Check toolbar in bot home app for new created bot, 599px
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC97280_2_01',
            'bot consumption toolbar for new created bot 599px'
        );
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_2_02',
            'check hamburger menu for disable snapshot, ask about and no link home bot 599px'
        );
        await aibotChatPanel.closeMobileHamburger();
        //Resize the window to 600px
        await setWindowSize(aibot600pxWindow);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        //Go to edit mode
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        //Enable snapshot and ask about, add external links in edit mode
        await botAuthoring.generalSettings.turnOnAllowSnapshot();
        await botAuthoring.generalSettings.enableTopicPanel();
        for (const link of externalLinks) {
            await botAuthoring.generalSettings.addExternalLink(link);
        }
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        //Resize the window to 599px
        await setWindowSize(aibot599pxWindow);
        await libraryAuthoringPage.waitForCurtainDisappear();
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_2_03',
            'check hamburger menu for enable snapshot, topic and with link home bot 599px'
        );
        //Click snapshot
        await aibotChatPanel.openMobileViewSnapshotPanel();
        await takeScreenshot('TC97280_2_04', 'open snapshot home bot 599px');
        //Close snapshot panel
        await aibotChatPanel.closeMobileViewSnapshotPanel();
        //Open ask about panel
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.openMobileViewAskAboutPanel();
        await takeScreenshot('TC97280_2_05', 'open ask about home bot 599px');
        //Close ask about panel
        await aibotChatPanel.closeMobileViewAskAboutPanel();
        //Click link
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.clickMobileViewLinksButton();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileViewLinksContainer(),
            'TC97280_2_06',
            'open link menu home bot 599px'
        );
        await aibotChatPanel.clickMobileViewLinksItemsbyIndex(0);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(externalLinks[0].url);
        await aibotChatPanel.switchToTab(0);
        await aibotChatPanel.closeTab(1);
        //Resize the window to 600px
        await setWindowSize(aibot600pxWindow);
        //Go to edit mode, disable snapshot and ask about, remove external links
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await botAuthoring.generalSettings.turnOffAllowSnapshot();
        await botAuthoring.generalSettings.disableTopicPanel();
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(0);
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(0);
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(0);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        //Resize the window to 599px
        await setWindowSize(aibot599pxWindow);
        await libraryAuthoringPage.waitForCurtainDisappear();
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_2_07',
            'check hamburger menu back to disable snapshot, ask about and no link home bot 599px'
        );
    });

    it('[TC97280_3] responsive view edit mode and consumption mode switch', async () => {
        //Create bot
        botId = await createBotByAPI({ credentials: consumptionResponsiveBotUser, botInfo: BotToCreate });
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: consumptionResponsiveBotUser,
            publishInfo: publishInfo,
        });
        //Open disable snapshot, ask about and no link bot, 599px
        await setWindowSize(aibot599pxWindow);
        await libraryPage.openBotById({
            projectId: BotToCreate.project.id,
            botId: botId,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_3_01',
            'check hamburger menu for disable snapshot, ask about and no link 599px'
        );
        await aibotChatPanel.closeMobileHamburger();
        //Resize the window to 600px
        await setWindowSize(aibot600pxWindow);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        //Go to edit mode
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        //Enable snapshot and ask about, add external links in edit mode
        await botAuthoring.generalSettings.turnOnAllowSnapshot();
        await botAuthoring.generalSettings.enableTopicPanel();
        for (const link of externalLinks) {
            await botAuthoring.generalSettings.addExternalLink(link);
        }
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        //Resize the window to 599px
        await setWindowSize(aibot599pxWindow);
        await libraryAuthoringPage.waitForCurtainDisappear();
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_3_02',
            'check hamburger menu for enable snapshot, topic and with link 599px'
        );
        //Click snapshot
        await aibotChatPanel.openMobileViewSnapshotPanel();
        await takeScreenshot('TC97280_3_03', 'open snapshot 599px');
        //Close snapshot panel
        await aibotChatPanel.closeMobileViewSnapshotPanel();
        //Open ask about panel
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.openMobileViewAskAboutPanel();
        await takeScreenshot('TC97280_3_04', 'open ask about 599px');
        //Close ask about panel
        await aibotChatPanel.closeMobileViewAskAboutPanel();
        //Click link
        await aibotChatPanel.openMobileHamburger();
        await aibotChatPanel.clickMobileViewLinksButton();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileViewLinksContainer(),
            'TC97280_3_05',
            'open link menu 599px'
        );
        await aibotChatPanel.clickMobileViewLinksItemsbyIndex(0);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(externalLinks[0].url);
        await aibotChatPanel.switchToTab(0);
        await aibotChatPanel.closeTab(1);
        //Resize the window to 600px
        await setWindowSize(aibot600pxWindow);
        //Go to edit mode, disable snapshot and ask about, remove external links
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await botAuthoring.generalSettings.turnOffAllowSnapshot();
        await botAuthoring.generalSettings.disableTopicPanel();
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(0);
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(0);
        await botAuthoring.generalSettings.deleteExternalLinkByIndex(0);
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        //Resize the window to 599px
        await setWindowSize(aibot599pxWindow);
        await libraryAuthoringPage.waitForCurtainDisappear();
        //Open humburger menu
        await aibotChatPanel.openMobileHamburger();
        await takeScreenshotByElement(
            aibotChatPanel.getMobileSliderMenu(),
            'TC97280_3_06',
            'check hamburger menu back to disable snapshot, ask about and no link 599px'
        );
    });
});
