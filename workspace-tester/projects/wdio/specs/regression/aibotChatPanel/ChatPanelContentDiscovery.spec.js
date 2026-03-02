import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProName } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';

describe('Chat Panel Content Discovery', () => {
    const aibot = {
        id: 'C734752CB44BC4E588B6DE891322A462',
        name: '17.ContentDiscovery',
    };

    let {
        loginPage,
        libraryPage,
        botConsumptionFrame,
        aibotChatPanel,
        contentDiscovery,
        listView,
        dossierPage,
        botAuthoring,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await setWindowSize(browserWindow);
        await libraryPage.openSidebarOnly();
        await libraryPage.sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(conEduProName);
        await contentDiscovery.openFolderByPath(['Shared Reports', 'F40130-aibot', 'aibot-automation']);
    });

    it('[TC92573_1] Open consumption mode by content discovery', async () => {
        await aibotChatPanel.clickContentDiscoveryBotByIndex(1);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC92573_1',
            'Open consumption mode by content discovery'
        );
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'content discovery consumption mode chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since(
            'content discovery consumption mode viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC92573_1',
            'Enter edit mode'
        );
    });

    it('[TC92573_2] Open edit mode by content discovery', async () => {
        await aibotChatPanel.hoverContentDiscoveryBotByIndex(1);
        await listView.clickDossierEditIcon(aibot.name, 0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await botAuthoring.waitForElementVisible(botAuthoring.generalSettings.getGenerlSettingsContainer());
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC92573_2',
            'Open edit mode by content discovery'
        );
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'content discovery edit mode chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since(
            'content discovery edit mode viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await botAuthoring.exitBotAuthoring();
        await since(
            'content discovery close edit mode list view display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isContentDiscoveryBotByIndexDisplayed(1))
            .toBe(true);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });
});
