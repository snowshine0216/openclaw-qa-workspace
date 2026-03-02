import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';
import { waitForResponse } from '../../../api/browserDevTools/network.js';
import { createBotByAPIV2, deleteBotList } from '../../../api/bot/index.js';

describe('Bot 2.0 Authoring', () => {
    let {
        loginPage,
        libraryPage,
        aibotChatPanel,
        aibotDatasetPanel,
        botAuthoring,
        botCustomInstructions,
        adc,
        bot2Chat,
        datasetsPanel,
    } = browsers.pageObj1;

    const generalSettings = botAuthoring.generalSettings;

    let object_bot = {
        id: '',
        name: 'AUTO_BotAuthoring_' + +Date.now(),
        project: bot.project_applicationTeam,
    };

    const object_adc = {
        id: '041634DA39432DB8B01467B997076C89',
        name: 'AUTO_ADC_OLAP_Premerge',
        project: bot.project_applicationTeam,
    };

    const object_folder = {
        id: 'A843D547244102415F982799FBD76665',
        path: 'MicroStrategy Tutorial > Shared Reports > Bot2.0 >Automation > premerge',
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.botV2Premerge);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        // Create bot
        object_bot.id = await createBotByAPIV2({
            credentials: bot.botV2Premerge,
            aiDatasetCollections: [object_adc.id],
            projectId: object_bot.project.id,
            folderId: object_folder.id,
            botName: object_bot.name,
            publishedToUsers: [bot.botV2Premerge.id],
        });

        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: bot.botV2Premerge,
            botList: [object_bot.id],
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99011_1] General settings - Update bot name, greeting and panel theme', async () => {
        // edit bot name
        const originalBotName = await generalSettings.getBotAliasName();
        await generalSettings.changeBotName(`${originalBotName}+`);
        await since('Bot alias name is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(`${originalBotName}+`);

        // edit bot greeting
        const originalBotGreeting = await generalSettings.getBotGreetingText();
        await generalSettings.changeGreeting(`${originalBotGreeting}+`);

        // edit panel theme
        await since('Panel theme should be default, bg color is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getPanelThemeColor())
            .toBe('#FFFFFF');
        await generalSettings.changePanelTheme();
        await since('Panel theme should be dark, bg color is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getPanelThemeColor())
            .toBe('#23262A');

        // save and reopen
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });

        // check settings
        await since('Reopen bot and Bot alias name is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(`${originalBotName}+`);
        await since('Reopen bot and Bot greeting is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessage().getText())
            .toBe(`${originalBotGreeting}+`);
        await since('Reopen bot and bg color is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getPanelThemeColor())
            .toBe('#23262A');
    });

    it('[TC99011_2] General settings - Add external link', async () => {
        // edit external link
        const externalLink = {
            title: 'TestLink',
            url: 'https://www.google.com',
        };
        await generalSettings.addExternalLink(externalLink);
        await since('Title bar external link count is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkCount())
            .toBe(1);

        // save and reopen
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });

        // check settings
        await since('Reopen, Title bar external link count is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkCount())
            .toBe(1);
    });

    it('[TC99011_3] General settings - Update suggestion', async () => {
        // custom suggestion
        const customSuggestion = 'This is a custom suggestion';
        await generalSettings.addCustomSuggestion(customSuggestion);
        await since('Custom suggestion present is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isCustomSuggestionDisplayed(customSuggestion))
            .toBe(true);

        // turn off suggestion
        await generalSettings.turnOffSuggestions();
        await since('Turned off, recommendation display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isRecommendationPanelPresent())
            .toBe(false);
        await since('Sugguestion number section display is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getSuggestionNumberSelect().isDisplayed())
            .toBe(false);

        // save and reopen to check modification
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });

        // check
        await aibotChatPanel.askQuestion('show profit by category in bar chart');
        await since('Reopen,recommendation display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isRecommendationPanelPresent())
            .toBe(false);
        await since('Reopen, Sugguestion section display is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getSuggestionNumberSelect().isDisplayed())
            .toBe(false);
    });

    it('[TC99011_4] General settings - Disable snapshot, interpretation and insights', async () => {
        // edit optional features - snapshot, interpretation, insights
        await aibotChatPanel.askQuestion('show profit by category in bar chart', true);
        if (await aibotChatPanel.isToBottomBtnDisplayed()) {
            await aibotChatPanel.clickToBottom();
        }
        await generalSettings.turnOffSnapshot();
        await generalSettings.turnOffInterpretation();
        await generalSettings.turnOffInsights();
        await since('Snapshot panel button display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(false);
        //check message button
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Snapshot display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatBotPinIconByIndex().isDisplayed())
            .toBe(false);
        await since('Interpretation display is expected to be #{expected}, instead we have #{actual} ')
            .expect(await aibotChatPanel.getInterpretationIcon().isDisplayed())
            .toBe(false);
        await since('Insights section display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(false);

        // save and reopen to check
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });
        await aibotChatPanel.askQuestion('show profit by category in bar chart', true);

        // check
        await since('Reopen and Snapshot panel button display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getOpenSnapshotPanelButton().isDisplayed())
            .toBe(false);
        await aibotChatPanel.hoverOnLatestAnswer();
        await since('Reopen and Snapshot display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatBotPinIconByIndex().isDisplayed())
            .toBe(false);
        await since('Reopen and Interpretation display is expected to be #{expected}, instead we have #{actual} ')
            .expect(await aibotChatPanel.getInterpretationIcon().isDisplayed())
            .toBe(false);
        await since('Reopen and Insights section display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isInsightsSectionDisplayed())
            .toBe(false);
    });

    it('[TC99011_5] Advanced settings - Update custom instruction ', async () => {
        const backgroud_text = 'When i ask quetion, please always answer against year within the dataset';
        const question = 'what is the total profit';
        const keywords = '2020;2021;2,761';

        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Custom instruction ON is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);
        await since('Inputbox editable is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(true);
        await since('format instruction text count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getCount(1))
            .toContain('240/1500');

        // edit instruction
        await botCustomInstructions.inputBackground(backgroud_text);
        await botAuthoring.saveExistingBotV2();
        await since('backgoud instruction text count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getCount(0))
            .toContain('72/5000');

        // save and ask question
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.askQuestion(question);
        await since(`Answer contains ${keywords} shoud be #{expected}, instead it is #{actual} `)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);

        // toggle off instruction
        await botCustomInstructions.disableCustomInstructions();
        await since('OFF and Inputbox editable is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isInputBoxEnabled())
            .toBe(false);

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });

        // check
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Reopen and custom instruction ON is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(false);
        await since('Reopen and backgoud text count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getCount(0))
            .toContain('72/5000');
    });

    it('[TC99011_6] Advanced settings - Update temperature ', async () => {
        await botAuthoring.selectBotConfigTabByName('custom-instruction');

        //check temperature default values
        let attFormTemperature = await botCustomInstructions.getAttributeFormTemperatureValue();
        let metricTemperature = await botCustomInstructions.getMetricTemperatureValue();
        let speakerTemperature = await botCustomInstructions.getSpeakerTemperatureValue();

        await since('Attribute form temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(attFormTemperature)
            .toBe('0.5');
        await since('Metric temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(metricTemperature)
            .toBe('0.2');
        await since('Speaker temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(speakerTemperature)
            .toBe('0.3');

        // set integer temperature values
        await botCustomInstructions.setAttributeFormTemperature('0');
        await botCustomInstructions.setMetricTemperature('0');
        await botCustomInstructions.setSpeakerTemperature('0');

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });

        // check saved value
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        attFormTemperature = await botCustomInstructions.getAttributeFormTemperatureValue();
        metricTemperature = await botCustomInstructions.getMetricTemperatureValue();
        speakerTemperature = await botCustomInstructions.getSpeakerTemperatureValue();
        await since('Reopen and Attribute form temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(attFormTemperature)
            .toBe('0');
        await since('Reopen and Metric temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(metricTemperature)
            .toBe('0');
        await since('Reopen and Speaker temperature is expected to be #{expected}, instead we have #{actual}')
            .expect(speakerTemperature)
            .toBe('0');
    });

    it('[TC99011_7] Data settings - Update description', async () => {
        const newDbDesc = 'New DB Description';
        const newAttrDesc = 'new form description';
        await botAuthoring.selectBotConfigTabByName('Data');

        // disable show description
        await aibotDatasetPanel.disableShowDescription();
        await since('Disable show description and the state should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getShowDescriptionState())
            .toBe('false');
        await since('Disable show description and visibility should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.hasDescriptionVisible())
            .toBe(false);

        // enable show description
        await aibotDatasetPanel.enableShowDescription();
        await since('Enable show description and visibility should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.hasDescriptionVisible())
            .toBe(true);

        // update description
        await aibotDatasetPanel.updateDatasetDescription('AUTO_OLAP', newDbDesc);
        await aibotDatasetPanel.updateObjectDescription('AUTO_OLAP', 'Year', newAttrDesc);
        await since('Table description should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDescriptionText('AUTO_OLAP'))
            .toBe(newDbDesc);

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Reopen and attribute description should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDescriptionText('AUTO_OLAP', 'Year'))
            .toBe(newAttrDesc);

        // reload all descriptions
        const reloadAllDatasetDescription = await browser.mock(
            `**/api/v2/bots/${object_bot.id}/datasetContainers/**/datasets/**/descriptions?conversationId=**`
        );
        await aibotDatasetPanel.openDatasetContextMenuV2('AUTO_OLAP');
        await aibotDatasetPanel.clickDatasetContextMenuItem('Reload All Descriptions');
        await waitForResponse(reloadAllDatasetDescription, 0);
        await reloadAllDatasetDescription.restore();

        await since('Realod all and attribute description should not be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getDescriptionText('AUTO_OLAP', 'Year'))
            .not.toBe(newAttrDesc);
    });

    it('[TC99011_8] Data settings - Hide attribute and metric', async () => {
        const attribute = 'Year';
        const metric = 'Unit Price';
        const question = 'what is the unit price in year 2020';
        const keywords = '49';
        await botAuthoring.selectBotConfigTabByName('Data');

        // hide attribute and metric
        await aibotDatasetPanel.disableShowDescription();
        await aibotDatasetPanel.hideDatasetObject(attribute);
        await aibotDatasetPanel.hideDatasetObject(metric);
        await since('Attribute hide status should be #{expected}, instead it is #{actual} ')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected(attribute))
            .toBe(false);
        await since('Metribute hide status should be #{expected}, instead it is #{actual} ')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected(metric))
            .toBe(false);

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: object_bot.project.id, botId: object_bot.id });
        await botAuthoring.selectBotConfigTabByName('Data');

        // check
        await since('Metribute hide status should be #{expected}, instead it is #{actual} ')
            .expect(await aibotDatasetPanel.isDatasetObjectSelected(metric))
            .toBe(false);
        await aibotChatPanel.askQuestion(question);
        await since(`Answer contain correct value shoud be #{expected}, instead it is #{actual} `)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(false);
    });

    it('[TC99011_9] Data settings - Update dataset', async () => {
        const attributeObject = {
            original_name: 'Quarter',
            new_name: 'MyFavoriteObject',
        };
        const metricObject = {
            metric: 'Cost',
            derived_metric: 'Sum (Cost)',
        };
        const question = 'what is the top 2 Sum (Cost) by MyFavoriteObject';
        const keywords = '2022 Q3;2022 Q1';

        await botAuthoring.selectBotConfigTabByName('Data');

        // update dataset
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await since('Update dataset from Bot, ADC page present should be #{expected}, instead we have #{actual}')
            .expect(await adc.isADCToolbarPresent())
            .toBe(true);

        // rename
        await datasetsPanel.renameObject(attributeObject.original_name, attributeObject.new_name);
        await since('Renamed and new name present should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.isAttributeMetricDisplayed(attributeObject.new_name))
            .toBe(true);

        // create derived metric
        const initDMCount = await datasetsPanel.getElementCountByType('DM');
        await datasetsPanel.rightClickAttributeMetricByName(metricObject.metric);
        await datasetsPanel.actionOnMenuSubmenu('Aggregate By', 'Sum');
        await since('Create DM, derived metric element count should be #{expected}, instead we have #{actual}')
            .expect(await datasetsPanel.getElementCountByType('DM'))
            .toBe(initDMCount + 1);

        // save ADC and check changes
        await adc.saveChanges();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.disableShowDescription();
        await since(`Element ${attributeObject.new_name} present should be #{expected}, while we get #{actual}`)
            .expect(await aibotDatasetPanel.isDatasetElementDisplayed(attributeObject.new_name))
            .toBe(true);
        await since(`Element ${metricObject.derived_metric} present should be #{expected}, while we get #{actual}`)
            .expect(await aibotDatasetPanel.isDatasetElementDisplayed(metricObject.derived_metric))
            .toBe(true);

        // ask question
        await aibotChatPanel.askQuestion(question);
        await since('Answer contains ${keywords} shoud be #{expected}, instead it is #{actual} ')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);
    });
});
