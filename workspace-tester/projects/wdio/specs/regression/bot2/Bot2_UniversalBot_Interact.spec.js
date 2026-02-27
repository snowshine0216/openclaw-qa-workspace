import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';
import { waitForResponse } from '../../../api/browserDevTools/network.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import createUniversalBotByAPIV2 from '../../../api/bot2/createUniversalBotAPIV2.js';
import deleteBotList from '../../../api/bot/deleteBot.js';

describe('Bot 2.0 Universal Bot Authoring and Consumption', () => {
    let {
        loginPage,
        libraryPage,
        aibotChatPanel,
        aibotDatasetPanel,
        botAuthoring,
        botCustomInstructions,
        bot2Chat,
        libraryAuthoringPage,
        botConsumptionFrame,
        aibotSnapshotsPanel,
    } = browsers.pageObj1;

    const generalSettings = botAuthoring.generalSettings;

    const project = bot.project_applicationTeam;

    const subBot_MTDI = {
        id: 'A22C4DE31912440F9003DE07754567AD',
        name: 'Auto_SubBot_MTDI',
        project: bot.project_applicationTeam,
    };

    const subBot_OLAP = {
        id: '2490CE01D5E84FCA9B319617CFEED99E',
        name: 'Auto_SubBot_OLAP',
        project: bot.project_applicationTeam,
    };

    const subBot_AddNewBot = {
        id: '3A46E9B37FD34C7FA7408698CD197CF5',
        name: 'Auto_SubBot_AddNewBot',
        project: bot.project_applicationTeam,
    };

    let interact_bot = {
        id: '',
        name: 'Auto_UniversalBot_' + +Date.now(),
        project: bot.project_applicationTeam,
    };

    //// for debugging
    // let interact_bot = {
    //     id: '6386590679924939882BD876B490EA01',
    //     name: 'Auto_Universal_ForConsumptionDebug',
    //     project: bot.project_applicationTeam,
    // };

    const folder = {
        id: '056A28140E45ABBF81ADF68D3AF9806A',
        path: ['Bot2.0', 'Folder for create bot'],
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.universalUser);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        // Create bot
        interact_bot.id = await createUniversalBotByAPIV2({
            credentials: bot.universalUser,
            subBots: [subBot_MTDI.id, subBot_OLAP.id],
            projectId: interact_bot.project.id,
            folderId: folder.id,
            botName: interact_bot.name,
            publishedToUsers: [bot.universalUser.userId],
        });
        // open bot edit mode
        await libraryPage.editBotByUrl({ projectId: interact_bot.project.id, botId: interact_bot.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: bot.universalUser,
            botList: [interact_bot.id],
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99015_4] Universal bot - consumption - Q&A', async () => {
        const question1 = 'what is the profit by category name, show in chart';
        const keywords1 = 'Electronics; Books; Movies; Music';

        const question2 = 'list the top 3 airline name with the highest total deplayed time';
        const keywords2 = 'Delta Air Lines; United Air Lines';

        // Ask question 1
        await aibotChatPanel.askQuestion(question1, true);
        await since('Category question, answer contains keyword should be #{expected}, while we get #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords1))
            .toBe(true);
        await aibotChatPanel.hoverOnLatestAnswer();
        await takeScreenshotByElement(
            await aibotChatPanel.getBottomButtonIconContainerbyIndex(0),
            'TC99015_4',
            'QA_AnswerBubble'
        );
        await aibotChatPanel.clickInterpretation();
        await since('Interpretated as displayed should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isInterpretedAsDisplayed())
            .toBe(true);
        await aibotChatPanel.clickInterpretationAdvancedOption();
        await since('Dataset used should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getDatasetUsedText())
            .toBe('AUTO_OLAP from Auto_SubBot_OLAP');
        await since('Object used should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getObjectUsedText())
            .toBe('Category, Profit');

        // Ask question 2
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.askQuestion(question2, true);
        await since('Airline question, answer contains keyword should be #{expected}, while we get #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords2))
            .toBe(true);
        await aibotChatPanel.hoverOnLatestAnswer();
        await aibotChatPanel.clickInterpretation();
        await since('2: Interpretated as displayed should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.isInterpretedAsDisplayed())
            .toBe(true);
        await aibotChatPanel.dismissFocus();
        await aibotChatPanel.clickInterpretationAdvancedOption();
        await since('2: Dataset used should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getDatasetUsedText())
            .toBe('AUTO_MTDI from Auto_SubBot_MTDI');
        // sometimes the object used order is different, so we sort it
        const ObjectUsed = await aibotChatPanel.getObjectUsedText();
        const sortedText = ObjectUsed.split(', ').sort();
        const actualText = sortedText.join(', ');
        await since('2: Object used should be #{expected}, while we get #{actual}')
            .expect(actualText)
            .toBe('Airline Name, Avg Delay (min), Flights Delayed');
    });

    it('[TC99015_5] Universal bot - consumption - suggestion', async () => {
        // initial suggestion
        await aibotChatPanel.waitForRecommendationLoading();
        await since('Recommendations should be displayed')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(0))
            .toBe(true);
        const initialSuggestion = await aibotChatPanel.getRecommendationTextsByIndex(0);

        // ask question by suggestion
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.openRecommendationPanel();
        await since('Suggestion should be shown is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(0))
            .toBe(true);
        const newSuggestion = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await since('Suggestions should be updated and expected not to be #{expected}, instead we have #{actual}')
            .expect(newSuggestion)
            .not.toBe(initialSuggestion);

        // refresh recommendation
        await aibotChatPanel.clickRefreshRecommendationIcon();
        await aibotChatPanel.waitForRecommendationLoading();
        const newSuggestion2 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await since('Suggestions should be refreshed and expected not to be #{expected}, instead we have #{actual}')
            .expect(newSuggestion2)
            .not.toBe(newSuggestion);
    });

    it('[TC99015_6] Universal bot - consumption - snapshot', async () => {
        const question1 = 'what is the profit by category';
        const keywords1 = '2,334; 242; 106; 80; Electronics; Books; Movies; Music';

        // Ask question
        await aibotChatPanel.askQuestion(question1, true);
        await since('Category question, answer contains keyword should be #{expected}, while we get #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords1))
            .toBe(true);

        // add to snapshot
        const lastAnswer = await aibotChatPanel.getNthParagraphOfTextAnswerFromEndV2(1);
        const lastAnswerText = await lastAnswer.getText();

        const pinButton = await aibotChatPanel.getPinButtonOfNthChatAnswer(1);
        await since('Pin button is expected to be displayed, instead we have #{actual}')
            .expect(await pinButton.isExisting())
            .toBe(true);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.getToastbyMessage('Snapshot added').isDisplayed();
        const unPinButton = await aibotChatPanel.getUnpinButtonOfNthChatAnswer(1);
        await since('Unpin button is expected to be #{expected}, instead we have #{actual}')
            .expect(await unPinButton.isExisting())
            .toBe(true);
        // check snapshot panel
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await since('Snapshot added, the count is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(1);
        // search
        await aibotSnapshotsPanel.searchByText(lastAnswerText);
        await since('search and the snapshot count is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(1);
        await aibotSnapshotsPanel.clearSearch();
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByIndex();
        await snapshot.clickDeleteButton();
        await snapshot.confirmDelete();
        await libraryPage.sleep(1000);
        await since('Snapshot deleted is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotSnapshotsPanel.getNumberOfDisplayedSnapshotCard())
            .toBe(0);
    });

    it('[TC99015_7] Universal bot - authoring - update general settings ', async () => {
        await botAuthoring.selectBotConfigTabByName('general');

        // edit bot name
        const originalBotName = await generalSettings.getBotAliasName();
        await generalSettings.changeBotName(`${originalBotName}+`);
        await since('Bot alias name is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(`${originalBotName}+`);

        // edit panel theme
        await since('Panel theme should be default, bg color is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getPanelThemeColor())
            .toBe('#FFFFFF');
        await generalSettings.changePanelTheme('Blue');
        await since('Panel theme should be blue, bg color is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getPanelThemeColor())
            .toBe('#FFFFFF');

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
        await libraryPage.editBotByUrl({ projectId: interact_bot.project.id, botId: interact_bot.id });
        await botAuthoring.selectBotConfigTabByName('general');

        // check settings
        await since('Reopen bot and Bot alias name is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(`${originalBotName}+`);
        await since('Reopen bot and bg color is expected to be #{expected}, instead we have #{actual}')
            .expect(await generalSettings.getPanelThemeColor())
            .toBe('#FFFFFF');
        await since('Reopen, Title bar external link count is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarExternalLinkCount())
            .toBe(1);
    });

    it('[TC99015_8] Universal bot - authoring - Disable snapshot, interpretation and insights', async () => {
        await botAuthoring.selectBotConfigTabByName('general');

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
        await libraryPage.editBotByUrl({ projectId: interact_bot.project.id, botId: interact_bot.id });
        await botAuthoring.selectBotConfigTabByName('general');
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

    it('[TC99015_9] Universal bot - authoring - update custom instruction ', async () => {
        const backgroud_text = `Please answer with the beginning 'My Pleasure: '`;
        const question = 'what is the total profit';
        const keywords = 'My Pleasure';

        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Custom instruction ON is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(true);
        await since('Instruction input text area count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getInputAreas().length)
            .toBe(2);
        await since('Temperature present is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.isTemperatureDisplayed())
            .toBe(false);
        await since('format instruction text count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getCount(0))
            .toContain('240/1500');

        // edit instruction
        await botCustomInstructions.inputCustomInstructions(backgroud_text);
        await botAuthoring.saveExistingBotV2();
        await since('backgoud instruction text count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getCount(0))
            .toContain('48/1500');

        // save and ask question
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.askQuestion(question);
        await since(`Answer contains ${keywords} shoud be #{expected}, instead it is #{actual} `)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);

        // toggle off instruction
        await botCustomInstructions.disableCustomInstructions();
        await since(`OFF and Inputbox editable is expected to be #{expected}, instead we have #{actual}`)
            .expect(await botCustomInstructions.getEnabledInputBox(0).isDisplayed())
            .toBe(false);

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: interact_bot.project.id, botId: interact_bot.id });

        // check
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await since('Reopen and custom instruction ON is expected to be #{expected}, instead we have #{actual}')
            .expect(await botCustomInstructions.isCustomInstructionsEnabled())
            .toBe(false);
        await since('Reopen and backgoud text count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await botCustomInstructions.getCount(0))
            .toContain('48/1500');
        await aibotChatPanel.askQuestion(question);
        await since(`Reopen and answer contains ${keywords} shoud not be #{expected}, instead it is #{actual} `)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .not.toBe(true);
    });

    it('[TC99015_10] Universal bot - authoring - update bot description', async () => {
        const newDesc = 'New Description for Testing';
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
        await aibotDatasetPanel.updateBotDescription(subBot_OLAP.name, newDesc);
        await since('Bot description should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotDescriptionText(subBot_OLAP.name))
            .toBe(newDesc);

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: interact_bot.project.id, botId: interact_bot.id });
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Reopen and attribute description should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotDescriptionText(subBot_OLAP.name))
            .toBe(newDesc);

        // reload all descriptions
        const reloadBotDescription = await browser.mock(
            `**/api/v2/bots/${interact_bot.id}/subBotDescriptions?id=${subBot_OLAP.id}`
        );
        await aibotDatasetPanel.openDatasetContextMenuV2(subBot_OLAP.name, true);
        await aibotDatasetPanel.clickDatasetContextMenuItem('Reload Description');
        await waitForResponse(reloadBotDescription, 0);
        await reloadBotDescription.restore();

        await since('Realod all and attribute description should not be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotDescriptionText(subBot_OLAP.name))
            .not.toBe(newDesc);
    });

    it('[TC99015_11] Universal bot - authoring - go to bot and delete bot', async () => {
        const question = 'what is the total profit';
        const keywords = '2,761; 2761';
        await botAuthoring.selectBotConfigTabByName('Data');

        // go to bot
        await aibotDatasetPanel.openDatasetContextMenuV2(subBot_OLAP.name, true);
        await aibotDatasetPanel.clickDatasetContextMenuItem('Go to Agent');
        await since('Go to agent, the tab count should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.tabCount())
            .toBe(2);
        await aibotChatPanel.switchToTab(1);
        await aibotChatPanel.waitForCurtainDisappear();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await aibotChatPanel.askQuestion(question);
        await since('Go to agent, the answer should be #{expected}, instead we have #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);
        await aibotChatPanel.closeTab(1);

        // delete bot
        const botCount = await aibotDatasetPanel.getSubBotCount();
        await aibotDatasetPanel.openDatasetContextMenuV2(subBot_OLAP.name, true);
        await since('Delete bot opetion present should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDatasetMenuItemDisplayed('Delete Agent'))
            .toBe(true);
        await aibotDatasetPanel.clickDatasetContextMenuItem('Delete Agent');
        await since('Delete agent, the agent count should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getSubBotCount())
            .toBe(botCount - 1);

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: interact_bot.project.id, botId: interact_bot.id });
        await botAuthoring.selectBotConfigTabByName('Data');

        // check
        await since('Reopen bot and the bot count should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getSubBotCount())
            .toBe(botCount - 1);
        await aibotDatasetPanel.openDatasetContextMenuV2(subBot_MTDI.name, true);
        await since('Reopen bot and the delete agent present should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isDatasetMenuItemDisplayed('Delete Agent'))
            .toBe(false);
    });

    it('[TC99015_12] Universal bot - authoring - add new agent', async () => {
        const question = 'what is the total flights delayed by year';
        const keywords = '85,511; 82,083; 6,588; 2009; 2010; 2011';
        await botAuthoring.selectBotConfigTabByName('Data');

        // add new bot
        await aibotDatasetPanel.clickNewBotButton();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('Agent tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await libraryAuthoringPage.getMenuItemInDatasetDialog('Agent').isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            await libraryAuthoringPage.getProjectSelectionWindowSideMenu(),
            'TC99015_7',
            'NewBot_Sidebar'
        );

        // Select one sub bot
        const botCount = await aibotDatasetPanel.getSubBotCount();
        await libraryAuthoringPage.selectProjectAndAIBots(project.name, [subBot_AddNewBot.name], true);
        await since('Sub bot count should be #{expected} but is #{actual}')
            .expect(await aibotDatasetPanel.getSubBotCount())
            .toBe(botCount + 1);

        // save and re-open
        await botAuthoring.saveExistingBotV2();
        await aibotChatPanel.goToLibrary();
        await libraryPage.editBotByUrl({ projectId: interact_bot.project.id, botId: interact_bot.id });
        await botAuthoring.selectBotConfigTabByName('Data');

        // check
        await since('Reopen and sub bot count should be #{expected} and it is #{actual}')
            .expect(await aibotDatasetPanel.getSubBotCount())
            .toBe(botCount + 1);

        await aibotChatPanel.askQuestion(question);
        await since(`Reopn and the answer contains ${keywords} should be #{expected}, instead we have #{actual}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);
    });

    it('[TC99015_17] Universal bot - authoring - manage alias', async () => {
        const add_alias_olap = 'Product Analysis Bot';
        const add_alias_mtdi = 'Flight Analysis Bot';
        const edit_alias = 'Sales Analysis Bot';
        await botAuthoring.selectBotConfigTabByName('Data');

        // add alias - olap bot
        await aibotDatasetPanel.openDatasetContextMenuV2(subBot_OLAP.name, true);
        await aibotDatasetPanel.clickDatasetContextMenuItem('Manage Alias');
        await takeScreenshotByElement(
            await aibotDatasetPanel.getBotAliasContainer(subBot_OLAP.name),
            'TC99015_17',
            'Manage_Alias'
        );
        await aibotDatasetPanel.addBotAlias(subBot_OLAP.name, add_alias_olap);
        await since('OLAP Bot alias preview should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasPreviewText(subBot_OLAP.name))
            .toBe(add_alias_olap);

        // add alias - mtdi bot
        await aibotDatasetPanel.addBotAlias(subBot_MTDI.name, add_alias_mtdi);
        await since('MTDI Bot alias preview should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasPreviewText(subBot_MTDI.name))
            .toBe(add_alias_mtdi);

        //save bot
        await botAuthoring.saveExistingBotV2();
        await since('Save bot and bot alias should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasPreviewText(subBot_OLAP.name))
            .toBe(add_alias_olap);
        await takeScreenshotByElement(
            await aibotDatasetPanel.getBotAliasContainer(subBot_OLAP.name),
            'TC99015_17',
            'Add_Alias'
        );

        // update alias - duplicated alias is not allowed
        await aibotDatasetPanel.openDatasetContextMenuV2(subBot_OLAP.name, true);
        await aibotDatasetPanel.clickDatasetContextMenuItem('Manage Alias');
        await aibotDatasetPanel.inputBotAlias(subBot_OLAP.name, add_alias_mtdi);
        await since('Dulicate bot name and warning present should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isBotAliasWarningDisplayed())
            .toBe(true);
        await since('Dulicate bot name and warning text should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasWarningText())
            .toContain('This name already exists. Please use a different one');
        await aibotDatasetPanel.enter();
        await since('Dulicate bot name and bot alias preview should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasPreviewText(subBot_OLAP.name))
            .toBe(add_alias_olap);

        // update alias - normal update
        await aibotDatasetPanel.editBotAlias(subBot_OLAP.name, edit_alias);
        await since('Updated bot alias preview should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasPreviewText(subBot_OLAP.name))
            .toBe(edit_alias);

        // save bot
        await botAuthoring.saveExistingBotV2();
        await since('Save bot after update and alias should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasPreviewText(subBot_OLAP.name))
            .toBe(edit_alias);

        // delete alias
        await aibotDatasetPanel.deleteBotAlias(subBot_OLAP.name);
        await since('Deleted bot alias and alias present should be #{expected} while we get #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasContainer(subBot_OLAP.name).isDisplayed())
            .toBe(false);

        await botAuthoring.saveExistingBotV2();
        await since('Save bot after delete and alias present should be #{expected} while we get #{actual}')
            .expect(await aibotDatasetPanel.getBotAliasContainer(subBot_OLAP.name).isDisplayed())
            .toBe(false);
    });
});
