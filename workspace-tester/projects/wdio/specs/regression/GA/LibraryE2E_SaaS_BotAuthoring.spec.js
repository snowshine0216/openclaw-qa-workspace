import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { deleteBotList } from '../../../api/bot/index.js';
import compareAnswerWithBaselineBySimilarity from '../../../utils/BaselineCompareUtils.js';
import { languageIdMap } from '../../../constants/bot.js';
// import deleteNuggetsList from '../../../api/bot/nuggets/deleteNuggetsList.js';
// import * as consts from '../../../constants/bot.js'
// import getNuggetInBot from '../../../api/bot/nuggets/getNuggetInBot.js';

describe('Create Bot on SaaS', () => {
    let { libraryPage, share, dossierPage, loginPage, botAuthoring, libraryAuthoringPage, shareDossier } = browsers.pageObj1;
    const botNameToUpdate = 'TC93409, create bot in saas';
    const saasProjectId = '69D4DA35264BAA98CC2BF68356064C35';
    let botId, nuggetId, botWithNuggetId;
    let credentials = browsers.params.credentials;
    // const botNameToShare = 'TC95127, create bot in saas';
    // let receipient = {
    //     username: '',
    //     password: '',
    // }
    const small_size_file = 'test_nugget_small.xlsx';

    beforeAll(async () => {
        if (browsers.params.credentials.isPredefined && browsers.params.credentials.isPredefined === 'true') {
            credentials = {
                username: 'saastest.bot@microstrategy.com',
                password: 'newman1#',
            };
        }
        console.log(credentials);
        await loginPage.saasLogin(credentials);
        await loginPage.waitForLibraryLoading();
        await libraryPage.executeScript('window.pendo.stopGuides();');
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        botId &&
            (await deleteBotList({
                botList: [botId],
                projectId: saasProjectId,
            }));
        botId = null;
        // await deleteNuggetsList({ 
        //     idList: [
        //         nuggetId,
        //     ] 
        // });
        await libraryPage.openDefaultApp();
    });

    it('[TC93409] create bot on SaaS', async () => {
        await libraryAuthoringPage.createBotWithNewData({ project: '' });
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates, true);
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Question limit settings should not display for trial users in SaaS, but it is displayed now!')
            .expect(await botAuthoring.generalSettings.getLimitsSection().isDisplayed())
            .toBe(false);
        await botAuthoring.generalSettings.updateBotName(botNameToUpdate);
        await botAuthoring.generalSettings.disableTopicSuggestion();
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC93409_01',
            'bot general settings tab'
        );
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await botAuthoring.botAppearance.triggerThemeTooltip();
        await botAuthoring.botAppearance.changeThemeTo('Yellow');
        await takeScreenshotByElement(botAuthoring.getBotConfigContainer(), 'TC93409_02', 'bot appearance to Yellow');
        await botAuthoring.selectBotConfigTabByName('Data');
        await botAuthoring.aibotDatasetPanel.openMenu();
        await takeScreenshotByElement(botAuthoring.getBotConfigContainer(), 'TC93409_03', 'bot dataset tab');
        await botAuthoring.saveAsBot({ name: botNameToUpdate });
        botId = await botAuthoring.getBotIdFromUrl();
        await botAuthoring.exitBotAuthoring();
        await dossierPage.goToLibrary();
        await libraryPage.openBotById({ projectId: saasProjectId, botId });
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC93409_04', 'bot toolbar');
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botAuthoring.generalSettings.getGenerlSettingsContainer(),
            'TC93409_05',
            'reopen bot general settings tab'
        );
        await botAuthoring.selectBotConfigTabByName('Appearance');
        await takeScreenshotByElement(botAuthoring.getBotConfigContainer(), 'TC93409_06', 'reopen bot appearance tab');
    });

    it('[TC93863] verify customization for bot on SaaS', async () => {
        await libraryAuthoringPage.createBotWithNewData({ project: '' });
        await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates, true);
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_01',
            'Upload small size file'
        );
        await botAuthoring.saveAsBot({ name: botNameToUpdate });
        botId = await botAuthoring.getBotIdFromUrl();
        await botAuthoring.exitBotAuthoring();
        // wait 1 min and check upload time
        await libraryPage.sleep(60000);
        await dossierPage.goToLibrary();
        await libraryPage.openBotById({ projectId: saasProjectId, botId });
        await libraryPage.executeScript('window.pendo.stopGuides();');
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getNuggetsItem(),
            'TC93236_01',
            'Re-edit bot'
        );
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await botAuthoring.saveBot({});
        await botAuthoring.exitBotAuthoring();
        await dossierPage.goToLibrary();
        await libraryPage.openBotById({ projectId: saasProjectId, botId });
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getKnowledgeSection(),
            'TC93236_01',
            'Remove Nugget'
        );

        await botAuthoring.custommizationPanel.enableCustomInstructions();
        await botAuthoring.custommizationPanel.inputFormat('always respond in Chinese');
        await botAuthoring.aibotChatPanel.askQuestionNoWaitViz('hello');
        let output = await botAuthoring.aibotChatPanel.getMarkDownByIndex(0).getText();
        console.log(`output is ${output}`);
        const { matchRes, similarity } = await compareAnswerWithBaselineBySimilarity({
            baselines: { result: '你好！请问有什么可以帮助你的吗?' },
            output: output,
            model: 'sentence-t5-large',
            threshold: 0.9,
        });

        await since(`response_style is 'always respond in Chinese' for question 'hello',
            the actual output is ${output}, the expect result is ${matchRes}`)
            .expect(matchRes)
            .toBe(true);
    });

    // it('[TC95217] verify share bot with nugget in SaaS', async () => {
    //     // create nugget
    //     await libraryAuthoringPage.createBotWithNewData({ project: '' });
    //     await botAuthoring.createBotBySampleData(languageIdMap.EnglishUnitedStates, true);
    //     await botAuthoring.selectBotConfigTabByName('custom-instruction');
    //     await botAuthoring.custommizationPanel.uploadNuggetsFile(small_size_file);
    //     await botAuthoring.saveAsBot({ name: botNameToShare });
    //     botWithNuggetId = botAuthoring.getBotIdFromUrl();
    //     // get nugget id
    //     nuggetId = getNuggetInBot({ credentials, botId: botWithNuggetId});
    //     await share.openSharePanel();
    //     await share.openShareDossierDialog();
    //     let url = await shareDossier.getLink();
    //     await shareDossier.closeDialog();
    //     await libraryPage.openDefaultApp();
    //     await libraryPage.switchUser(receipient);
    //     await libraryPage.switchToNewWindowWithUrl(url);
    //     await dossierPage.waitForDossierLoading();
    //     await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
    //     await libraryAuthoringPage.waitForCurtainDisappear();
    //     await botAuthoring.selectBotConfigTabByName('custom-instruction');
    //     await botAuthoring.custommizationPanel.scrollToBottom();
    //     // no read and execute acl
    //     await since('Shared nugget, no execute acl warning should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAuthoring.custommizationPanel.getExecuteAclWarningMessage())
    //         .toBe(consts.noExecuteAclMessage);
    //     await since('Shared nugget, no acl warning should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAuthoring.custommizationPanel.getWarningMessage(1))
    //         .toBe(consts.noReadAclMessage);
    //     // remove nugget, check privilege
    //     await botAuthoring.custommizationPanel.deleteNuggetItem();
    //     await since('Shared nugget, no privilege warning should be #{expected}, instead we have #{actual}.')
    //         .expect(await botAuthoring.custommizationPanel.getWarningMessage())
    //         .toBe(consts.noPrivilegeMessage);
    // });
});
