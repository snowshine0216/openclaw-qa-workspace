import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { botConfigTopicUser, getBotObjectToEdit, languageIdMap } from '../../../constants/bot.js';

describe('AI Bot Topics Configuration', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, botAuthoring } = browsers.pageObj1;
    const botIdsToDelete = [];
    const botName = 'TC93320 Bot Topics Test';
    const BotToCreate = getBotObjectToEdit({ botName: botName, version: 'v1' });
    const adminUser = {
        username: 'mstr1',
        password: 'newman1#',
        id: '86A002474C1A18F1F92F2B8150A43741',
    };
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botConfigTopicUser);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        if (botIdsToDelete.length > 0) {
            await deleteBotList({
                credentials: adminUser,
                botList: [...botIdsToDelete],
                projectId: BotToCreate.project.id,
            });
            botIdsToDelete.length = 0;
        }
    });

    it('[TC93320_01] create bot and upload dataset', async () => {
        // 1. 3 topics are auto generated and not add topics button
        // 2. turn off topics -> topics panel hidden, topics suggestion button in chatpanel hidden
        // 3. turn on topics -> topics panel shown, topics suggestion button in chatpanel shown, previous topics show up
        await libraryAuthoringPage.createBotWithNewData({});
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates);
        // check if topiic are generated and shown in chat panel
        await since('Auto generated topics should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getTopicSuggestions().isDisplayed())
            .toBe(true);
        await since('After create a new bot, ask about in chat panel should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getAskAbout().isDisplayed())
            .toBe(true);
        await botAuthoring.selectBotConfigTabByName('General');
        await since(
            'After create bot with sample data, Auto generated topics should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.generalSettings.getTopicsCount())
            .toBe(3);
        // check if no add button
        await since('Auto Generate button shows up should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isAutoGenerateTopicsButtonPresent())
            .toBe(false);
        await since('Add Customized Topic button shows up should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isAddCustomTopicButtonPresent())
            .toBe(false);
        // check if toggles are on in General settings
        await since('Topics toggle should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isTopicsSuggestionEnabled())
            .toBe(true);
        await since('Topics panel should be shown should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isTopcisPanelEnabled())
            .toBe(true);

        const topicsTitle = [];
        const topicsDescription = [];
        for (let i = 0; i < 3; i++) {
            topicsTitle.push(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(i));
            topicsDescription.push(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(i));
        }

        // turn off topic suggestion
        await botAuthoring.generalSettings.disableTopicSuggestion();
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getTopicSection(),
            'TC93320_01_01',
            'Disable topic suggestion'
        );
        // to add chatpanel check
        await since(
            'After disabel topic suggestion, auto suggestion count in chat panel should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.aibotChatPanel.getRecommendationQuestionItems().length)
            .toBe(3);

        // turn on topic suggestion
        await botAuthoring.generalSettings.enableTopicSuggestion();
        for (let i = 0; i < 3; i++) {
            await since('Topic title should be #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(i))
                .toBe(topicsTitle[i]);
            await since('Topic description should be #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(i))
                .toBe(topicsDescription[i]);
        }

        // turn off topic panel
        await botAuthoring.generalSettings.disableTopicPanel();
        // add chatpanel check
        await since(
            'After enable topic panel, ask about in chat panel should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.aibotChatPanel.getAskAbout().isDisplayed())
            .toBe(false);
    });

    it('[TC93320_02] create bot with new dataset', async () => {
        // 1. 3 topics are auto generated
        // 2. delete 2 topic -> no delete button
        // 3. click auto generate button -> new 2 topics are added
        await libraryAuthoringPage.createBotWithDataset({ dataset: 'byd_balance_ds_en' });
        await botAuthoring.selectBotConfigTabByName('General');
        // check if topic are generated
        await since('Auto generated topics should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTopicsCount())
            .toBe(3);
        // save topic 1 and 2's title and description:
        const topicsTitle = [];
        const topicsDescription = [];
        for (let i = 1; i < 3; i++) {
            topicsTitle.push(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(i));
            topicsDescription.push(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(i));
        }
        // remove topics
        for (let i = 0; i < 2; i++) {
            await botAuthoring.generalSettings.removeTopicByIndex(0);
        }
        // no delete button anymore
        await since(
            'When there is only one topic left, delete button shows up should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.generalSettings.isDeleteTopicButtonPresent(0))
            .toBe(false);
        // customize topic button and auto generate button shows up
        await since('Auto Generate button shows up should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isAutoGenerateTopicsButtonPresent())
            .toBe(true);
        await since('Add Customized Topic button shows up should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isAddCustomTopicButtonPresent())
            .toBe(true);
        // click auto generate button
        await botAuthoring.generalSettings.autoGenerateTopics();
        // check current topics are 3
        await since('Auto generated topics should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTopicsCount())
            .toBe(3);
        // check current topics are not the same as previous
        for (let i = 1; i < 3; i++) {
            await since('Topic title should be #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(i))
                .not.toBe(topicsTitle[i]);
            await since('Topic description should be #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(i))
                .not.toBe(topicsDescription[i]);
        }
    });

    it('[TC93320_03] check existing bot', async () => {
        // 1. by default 2 toggles are off
        // 2. turn on topics -> topics panel shown, topics suggestion button in chatpanel shown
        // 3. click refresh button -> new topics are returned

        let botId = await createBotByAPI({ credentials: adminUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // check if topic suggestion and panel are off
        await since('Topics toggle should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isTopicsSuggestionEnabled())
            .toBe(false);
        await since('Topics panel should be shown should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.isTopcisPanelEnabled())
            .toBe(false);
        // turn on topic suggestion
        await botAuthoring.generalSettings.enableTopicSuggestion();
        // check if 3 topics are auto generated
        await since('Auto generated topics should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getTopicsCount())
            .toBe(3);
        // save 3 topics' title and description
        const topicsTitle = [];
        const topicsDescription = [];
        for (let i = 0; i < 3; i++) {
            topicsTitle.push(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(i));
            topicsDescription.push(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(i));
        }
        // click refresh button
        await botAuthoring.generalSettings.refreshTopics(0);
        // check topics are not duplicated with previous ones
        for (let i = 0; i < 3; i++) {
            await since('After regenerate topic, Topic title should not be #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(0))
                .not.toBe(topicsTitle[i]);
            await since('After regenerate topic, Topic description should not be #{expected}, instead we have #{actual}.')
                .expect(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(0))
                .not.toBe(topicsDescription[i]);
        }
    });

    it('[TC93320_04] check add customized topics', async () => {
        // no api needed
        // 1. remove 1 topic
        // 2. add new topic with empty title
        // 4. add new topic with long title and description
        // 5. check new topic with empty title then refresh
        // 6. check long title and description returned from gpt -- omitted
        await libraryAuthoringPage.createBotWithDataset({ dataset: 'byd_balance_ds_en' });
        await botAuthoring.selectBotConfigTabByName('General');
        // remove 1 topic
        await botAuthoring.generalSettings.removeTopicByIndex(0);
        // add new topic with empty title
        await botAuthoring.generalSettings.addCustomTopic({ title: '', description: 'description' });
        await takeScreenshotByElement(
            await botAuthoring.generalSettings.getTopicItemByIndex(2),
            'TC93320_04_01',
            'Add new topic with empty title'
        );
        // refresh topic
        await botAuthoring.generalSettings.refreshTopics(2);
        // title and description should not be Empty
        await since(
            'After refresh topic for empty title topic, topic title should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.generalSettings.getTopicsTitleTextByIndex(2))
            .not.toBe('');
        await since(
            'After refresh topic for empty title topic, topic description should be #{expected}, instead we have #{actual}.'
        )
            .expect(await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(2))
            .not.toBe('');
        // add over 70 chars title and 180 chars description
        const longTitle = 'a'.repeat(72);
        const longDescription = 'b'.repeat(182);
        await botAuthoring.generalSettings.editCustomTopicByIndex(0, {
            title: longTitle,
            description: longDescription,
        });
        await since('Topic title length should be #{expected}, instead we have #{actual}.')
            .expect((await botAuthoring.generalSettings.getTopicsTitleTextByIndex(0)).length)
            .toBe(70);
        await since('Topic description length should be #{expected}, instead we have #{actual}.')
            .expect((await botAuthoring.generalSettings.getTopicsDescriptionTextByIndex(0)).length)
            .toBe(180);
    });
});
