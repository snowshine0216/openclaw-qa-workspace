import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import deleteObjectByNames from '../../../api/folderManagement/deleteObjectByNames.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';

describe('Bot 2.0 Universal Bot Create', () => {
    let {
        loginPage,
        libraryPage,
        aibotChatPanel,
        aibotDatasetPanel,
        botAuthoring,
        bot2Chat,
        libraryAuthoringPage,
        botConsumptionFrame,
        manageAccess,
    } = browsers.pageObj1;

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

    const subBot_Inactive = {
        id: 'D39F73ED99D84286B17D72A44909584E',
        name: 'Auto_SubBot_Inactive',
        project: bot.project_applicationTeam,
    };

    const subBot_ACL = {
        id: 'CF507E72DA994C11A25B0AA441B7C3E7',
        name: 'AUTO_Bot_ACL',
        project: bot.project_applicationTeam,
    };

    const universalBot_single = {
        name: 'Auto_UniversalBot_Single_' + Date.now(),
    };

    const universalBot_multi = {
        name: 'Auto_UniversalBot_Multi_' + Date.now(),
    };

    const universalBot_saveAs = {
        name: 'Auto_UniversalBot_SaveAs_' + Date.now(),
    };

    const universalBot_inactive = {
        id: '7FA99C00790A416C96D7E9E2BDCF22C3',
        name: 'Auto_Universal_InactiveSubBot',
        project: bot.project_applicationTeam,
    };

    const universalBot_acl = {
        id: '85527E3B429A491BAC2FB3E285E0FD0B',
        name: 'Auto_Universal_ACL',
        project: bot.project_applicationTeam,
    };

    const universalBot_alias = {
        id: 'BE375FB02244519894D4DC8FA7949957',
        name: 'Auto_Universal_Alias',
        project: bot.project_applicationTeam,
    };

    const folder = {
        id: '056A28140E45ABBF81ADF68D3AF9806A',
        path: ['Bot2.0', 'Folder for create bot'],
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.resetToLibraryHome();

        await loginPage.login(bot.universalUser);
        await libraryPage.waitForLibraryLoading();
    });

    afterEach(async () => {
        await deleteCreatedBots();
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {
        await deleteCreatedBots();
        await logoutFromCurrentBrowser();
    });

    async function deleteCreatedBots() {
        await deleteObjectByNames({
            credentials: bot.universalUser,
            projectId: project.id,
            parentFolderId: folder.id,
            names: [universalBot_single.name, universalBot_multi.name, universalBot_saveAs.name],
        });
    }

    it('[TC99015_1] Universal bot - create from single sub bot', async () => {
        // Create a new bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('New bot button display should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getNewBotButton()).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('AI Agent tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getMenuItemInDatasetDialog('Agent')).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            await libraryAuthoringPage.getProjectSelectionWindowSideMenu(),
            'TC99015_1',
            'AddData'
        );

        // Select one sub bot
        await libraryAuthoringPage.selectProjectAndAIBots(project.name, [subBot_MTDI.name]);

        // Save bot
        await botAuthoring.saveBotWithName(universalBot_single.name, folder.path);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(universalBot_single.name);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(universalBot_single))
            .toBe(true);
    });

    it('[TC99015_2] Universal bot - create from multiple sub bot', async () => {
        // Create a new bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('New bot button display should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getNewBotButton()).isDisplayed())
            .toBe(true);
        await libraryAuthoringPage.clickNewBot2Button();
        await libraryAuthoringPage.waitForProjectSelectionWindowAppear();
        await since('AI Agent tab display in data select dialog should be #{expected} but is #{actual}')
            .expect(await (await libraryAuthoringPage.getMenuItemInDatasetDialog('Agent')).isDisplayed())
            .toBe(true);

        // Select multiple sub agents
        await libraryAuthoringPage.selectProjectAndAIBots(project.name, [subBot_MTDI.name, subBot_OLAP.name]);

        // Save bot
        await botAuthoring.saveBotWithName(universalBot_multi.name, folder.path);
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await botConsumptionFrame.getBotName())
            .toEqual(universalBot_multi.name);

        // Back to library home
        await aibotChatPanel.goToLibrary();
        await since('Back to library page, the new bot in library should be "#{expected}", instead we have "#{actual}"')
            .expect(await libraryPage.isDossierInLibrary(universalBot_multi))
            .toBe(true);
    });

    it('[TC99015_3] Universal bot - save as new universal bot', async () => {
        const question = 'what is the total flights cancelled by year';
        const keywords = '3,952; 6,842; 982; 2009; 2010; 2010';

        // Run bot, save as new
        await libraryPage.editBotByUrl({
            projectId: universalBot_acl.project.id,
            botId: universalBot_acl.id,
        });
        await botAuthoring.openButtonMenu();
        await botAuthoring.clickSaveAsButton();
        await libraryAuthoringPage.saveToFolder(universalBot_saveAs.name, folder.path);
        await aibotChatPanel.goToLibrary();

        // Check ACL
        await libraryPage.openDossierContextMenu(universalBot_saveAs.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await manageAccess.waitForManageAccessLoading();
        await since(`${bot.universalUser.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(bot.universalUser.username))
            .toBe('Full Control');
        await since(`Everyone ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL('Everyone'))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();

        // Run bot, check if there is any error
        await libraryPage.openBot(universalBot_saveAs.name);
        await since('Run bot should be successful without error')
            .expect(await aibotChatPanel.isErrorPresent())
            .toBe(false);
        // Ask question
        await aibotChatPanel.askQuestion(question);
        await since(`the answer contains ${keywords} should be #{expected}, instead we have #{actual}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);
        await aibotChatPanel.goToLibrary();
    });

    it('[TC99015_13] Universal bot - error handling for inactive bot', async () => {
        const question = 'list all the airline name';
        const keywords = 'No suitable agents;Sorry';

        await libraryPage.editBotByUrl({
            projectId: universalBot_inactive.project.id,
            botId: universalBot_inactive.id,
        });

        // warning icon
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('Inactive warning icon displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isWarningForBotDisplayed(subBot_Inactive.name))
            .toBe(true);
        await takeScreenshotByElement(
            await aibotDatasetPanel.getBotHeader(subBot_Inactive.name),
            'TC99015_14',
            'InactiveBot'
        );

        // ask question and check suggestions
        await aibotChatPanel.askQuestion(question);
        await since('the answer with keywords existing should be #{expected}, instead we have #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);
        await aibotChatPanel.openRecommendationPanel();
        for (let i = 0; i < 3; i++) {
            await since(`${i} : Suggetion not contains airline should be #{expected}, instead we have #{actual}`)
                .expect(await aibotChatPanel.getRecommendationByIndex(i).getText())
                .not.toContain('airline');
        }

        // question by suggestion
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await since('Send question by suggestion, answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getAnswerCount())
            .toBeGreaterThan(1);
    });

    it('[TC99015_14] Universal bot - ACL - No ACL to sub bot', async () => {
        const question = 'what is the profit by year';
        const keywords = 'No suitable agents;Sorry;cannot be found;not available;rephrase your question;does not correspond to';

        // switch to acl user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.aclUser_bot);

        await deleteBotV2ChatByAPI({
            botId: universalBot_acl.id,
            projectId: universalBot_acl.project.id,
            credentials: bot.aclUser_bot,
        });

        // open universal bot
        await libraryPage.editBotByUrl({
            projectId: universalBot_acl.project.id,
            botId: universalBot_acl.id,
        });

        // not able to edit description
        await botAuthoring.selectBotConfigTabByName('Data');
        await since('No write acl and description disabled should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isBotDescriptionDisabled(subBot_ACL.name))
            .toBe(true);

        // ask question
        await aibotChatPanel.askQuestion(question);
        await since('the answer containing keywords should be #{expected}, instead we have #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(keywords))
            .toBe(true);

        // check suggestions
        await aibotChatPanel.openRecommendationPanel();
        for (let i = 0; i < 3; i++) {
            await since(`${i} : suggestion not contains profit should be #{expected}, instead we have #{actual}`)
                .expect(await aibotChatPanel.getRecommendationByIndex(i).getText())
                .not.toContain('profit');
        }
    });

    it('[TC99015_15] Universal bot - ACL - No ACL to ADC', async () => {
        const question = 'what is the profit by category';
        // const keywords = 'No suitable bots; Sorry';

        // switch to acl user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.aclUser_ds);

        // open universal bot
        await libraryPage.editBotByUrl({ projectId: universalBot_acl.project.id, botId: universalBot_acl.id });
        await since('Open bot error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);

        // ask question
        await aibotChatPanel.askQuestion(question);
        await since('the error answer displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isErrorAnswerDisplayedByIndex())
            .toBe(true);

        ////// current behavior: no suggestions shown when error answer displayed
        // // check suggestions
        // await aibotChatPanel.openRecommendationPanel();
        // for (let i = 0; i < 3; i++) {
        //     await since(`${i} : suggestion not contains profit should be #{expected}, instead we have #{actual}`)
        //         .expect(await aibotChatPanel.getRecommendationByIndex(i).getText())
        //         .not.toContain('profit');
        // }
    });

    it('[TC99015_16] Universal bot - ACL - No ACL to dataset', async () => {
        const question = 'what is the profit by category';
        // const keywords = 'No suitable bots; Sorry';

        // switch to acl user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.aclUser_adc);

        // open universal bot
        await libraryPage.editBotByUrl({ projectId: universalBot_acl.project.id, botId: universalBot_acl.id });
        await since('Open bot error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);

        // ask question
        await aibotChatPanel.askQuestion(question);
        await since('the error answer displayed should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isErrorAnswerDisplayedByIndex())
            .toBe(true);
    });

    it('[TC99015_18]  Universal bot - @bot - search bot with different bot name and alias name', async () => {
        await libraryPage.openBotById({ projectId: universalBot_alias.project.id, botId: universalBot_alias.id });

        // @ to trigger auto complete to load all sub bots
        await aibotChatPanel.typeInChatBox('@');
        await since(`input @ and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(true);
        await since(`input @ and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99015_18',
            'AutoCompleteList_AllBots'
        );

        // bot normal name
        await aibotChatPanel.typeInChatBox('@duct');
        await since(`input name @duct and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.typeInChatBox('@p');
        await since(`input name @p and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await aibotChatPanel.typeInChatBox('@product');
        await since(`input name @product and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await aibotChatPanel.typeInChatBox('@sales');
        await since(`input name @sales and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);

        // name with special chars
        await aibotChatPanel.typeInChatBox('@product &');
        await since(`input special chars & and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await aibotChatPanel.typeInChatBox('@AUTO_');
        await since(`input special chars _ and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99015_18',
            'AutoCompleteList_SpecialChars'
        );

        // name with space
        await aibotChatPanel.typeInChatBox('@product ');
        await since(`input space @product  and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);

        // chinese name
        await aibotChatPanel.typeInChatBox('@中文');
        await since(`input chinese @中文 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99015_18',
            'AutoCompleteList_Chinese'
        );
        await aibotChatPanel.typeInChatBox('@测试');
        await since(`input chinese @测试 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await aibotChatPanel.typeInChatBox('@别名');
        await since(`input chinese @别名 and suggestion present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);

        // korean name
        // 한국어 별칭 테스트
        // This bot alias is to test long long long long long long long long long name
        await aibotChatPanel.typeInChatBox('@한국');
        await since(`input korean @한국 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await aibotChatPanel.typeInChatBox('@테스');
        await since(`input korean @테스 and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(1);
        await takeScreenshotByElement(
            await aibotChatPanel.getAutoCompleteArea(),
            'TC99015_18',
            'AutoCompleteList_Korean'
        );
    });

    it('[TC99015_19] Universal bot - @bot - select bot from auto complete list', async () => {
        await libraryPage.openBotById({ projectId: universalBot_alias.project.id, botId: universalBot_alias.id });

        // trigger auto complete
        await aibotChatPanel.typeInChatBox('@');
        await since(`input @ and suggestion item count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getAutoCompleteItemCount())
            .toBe(3);

        // select bot auto complete
        await aibotChatPanel.navigateUpWithArrow(2);
        await takeScreenshotByElement(await aibotChatPanel.getAutoCompleteArea(), 'TC99015_18', 'AutoCompleteList_Up');
        await aibotChatPanel.navigateDownWithArrow(1);
        await aibotChatPanel.tab();
        await since(`input box value should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getInputBoxText())
            .toContain('Auto_SubBot_OLAP');
        await takeScreenshotByElement(await aibotChatPanel.getInputBox(), 'TC99015_18', 'AutoComplete_SelectedBot');

        // @bot can only be triggered once in one time
        await aibotChatPanel.typeKeyboard('@');
        await since(`input second @ and suggestion list present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAutoCompleteAreaDisplayed())
            .toBe(false);
        await aibotChatPanel.clearInputbox();

        // delete selected bot
        await aibotChatPanel.clearInputbox();
        await since(`after delete and input box value should be empty, instead we have #{actual}`)
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe('');
    });

    it('[TC99015_20] Universal bot - @bot - Q&A when @bot in the questions', async () => {
        const question = 'What is the total flights cancelled ';
        const answerKeywords = '11,776; 11776';
        await deleteBotV2ChatByAPI({
            botId: universalBot_alias.id,
            projectId: universalBot_alias.project.id,
            credentials: bot.universalUser,
        });
        await libraryPage.openBotById({ projectId: universalBot_alias.project.id, botId: universalBot_alias.id });

        // ask question with @bot
        await aibotChatPanel.typeInChatBox(question);
        await aibotChatPanel.typeKeyboard(`@${subBot_MTDI.name}`);
        await aibotChatPanel.tab();
        await aibotChatPanel.enter();
        await aibotChatPanel.waitForAnswerLoading();
        await since(`@bot and the answer contains ${answerKeywords} should be #{expected}, instead we have #{actual}`)
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(answerKeywords))
            .toBe(true);

        // ask question without @bot
        await aibotChatPanel.askQuestion(question);
        await since(
            `Without @bot and the answer contains ${answerKeywords} should be #{expected}, instead we have #{actual}`
        )
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords(answerKeywords))
            .toBe(true);

        // ask about
        await aibotChatPanel.openAskAboutPanel();
        await aibotChatPanel.expandAskAboutObjectByName(subBot_MTDI.name);
        await since(`Alias present should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.isAliasDispalyedForAskAboutObject(subBot_MTDI.name, 'product & sales'))
            .toBe(true);
        await takeScreenshotByElement(
            await aibotChatPanel.getAskAboutPanelObjectAliasesByObjectName(subBot_MTDI.name),
            'TC99015_19',
            'AskAbout_AliasDisplay'
        );
        await aibotChatPanel.clickStartConversationInAskAboutPanel2(subBot_MTDI.name);
        await since(`the answer count should be #{expected}, instead we have #{actual}`)
            .expect(await aibotChatPanel.getValidAnswerCount())
            .toBe(3);
    });
});
