import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import {
    nuggetTestUser,
    inheritedMessageInChinese,
    inheritedMessageTitleInChinese,
    getBotObjectToEdit,
    getPublishInfo,
} from '../../../constants/bot.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { createNuggets } from '../../../api/bot/nuggets/createNuggetsRestAPI.js';
import deleteNuggetsList from '../../../api/bot/nuggets/deleteNuggetsList.js';
import certifyNugget from '../../../api/bot/nuggets/certifyNugget.js';
import editCustomApp from '../../../api/customApp/editCustomApp.js';
import waitNuggetReady from '../../../api/bot/nuggets/waitNuggetReady.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import setUserLanguage from '../../../api/setUserLanguage.js';
import urlParser from '../../../api/urlParser.js';
import * as consts from '../../../constants/bot.js';
import { createBotByAPI, publishBotByAPI } from '../../../api/bot/index.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';

describe('App level nugget', () => {
    let { loginPage, libraryPage, libraryAuthoringPage, dossierPage, botAuthoring, aibotChatPanel, userAccount } =
        browsers.pageObj1;
    let nuggetId,
        customAppWithNuggets = ' --with app nuggets',
        customAppIdWithNuggets,
        customAppWithNuggetsBody,
        customAppWithoutNuggets = ' --no app nuggets',
        customAppIdWithoutNuggets,
        customAppWithoutNuggetsBody,
        botName = 'TC94096 bot',
        botId,
        botBody,
        publishInfo;

    const nugget_file = 'RAG.xlsx';
    const question = '010101What is the profit margin for Books for month of Feb 2020 for Art & Architecture?';
    const datasets = [
        {
            id: '36175BBBF248FD87B8FA43BF28048FD2',
            name: 'rag_sanity_ds',
        },
    ];

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(nuggetTestUser);
        // create valid nugget
        nuggetId = await createNuggets({ credentials: nuggetTestUser, fileName: nugget_file });
        // wait for nugget status to be ready
        await waitNuggetReady({ credentials: nuggetTestUser, id: nuggetId });
        // certify nugget
        await certifyNugget({ nuggetId: nuggetId, credentials: nuggetTestUser });
        // create bot
        botBody = getBotObjectToEdit({
            version: 'v2',
            botName: botName,
            enableInterpretation: true,
            datasets,
        });
        botId = await createBotByAPI({
            credentials: nuggetTestUser,
            botInfo: botBody,
        });
        // publish bot
        publishInfo = getPublishInfo({
            botId,
            recipients: [{ id: nuggetTestUser.id }],
        });
        await publishBotByAPI({
            credentials: nuggetTestUser,
            publishInfo: publishInfo,
        });
        // create custom app with nuggets
        customAppWithNuggetsBody = getCustomAppBody({
            version: 'v6',
            name: customAppWithNuggets,
            applicationNuggets: [nuggetId],
        });
        customAppIdWithNuggets = await createCustomApp({
            credentials: nuggetTestUser,
            customAppInfo: customAppWithNuggetsBody,
        });
        // create custom app without nuggets
        customAppWithoutNuggetsBody = getCustomAppBody({
            version: 'v6',
            name: customAppWithoutNuggets,
        });
        customAppIdWithoutNuggets = await createCustomApp({
            credentials: nuggetTestUser,
            customAppInfo: customAppWithoutNuggetsBody,
        });
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await libraryPage.openDefaultApp();
        await deleteCustomAppList({
            credentials: nuggetTestUser,
            customAppIdList: [customAppIdWithNuggets, customAppIdWithoutNuggets],
        });
        await deleteBotList({
            credentials: nuggetTestUser,
            botList: [botId],
        });
        await deleteNuggetsList({
            credentials: nuggetTestUser,
            idList: [nuggetId],
        });
    });

    it('[TC94096_01] Check custom app with app level nuggets', async () => {
        // check custom app with nuggets
        await libraryPage.editBotByUrl({ appId: customAppIdWithNuggets, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await takeScreenshotByElement(
            await botAuthoring.custommizationPanel.getKnowledgeContainerDescription(),
            'TC94096_01_01',
            'Bot with app level nugget'
        );
        // switch to custom app without app level nuggets
        await botAuthoring.exitBotAuthoring();
        await userAccount.switchCustomApp(customAppWithoutNuggets);
        await libraryPage.openDossier(botName);
        await dossierPage.waitForDossierLoading();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await since('1 Knowledge section should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getKnowledgeContainerDescriptionTitle())
            .toBe('Bot knowledge:');
        // back
        await libraryPage.editBotByUrl({ appId: customAppIdWithNuggets, botId });
        // remove nugget
        await editCustomApp({
            credentials: nuggetTestUser,
            id: customAppIdWithNuggets,
        });
        await libraryPage.refresh();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        // check inherited message
        await since('2 Remove nugget, knowledge section should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getKnowledgeContainerDescriptionTitle())
            .toBe('Bot knowledge:');
        // add nugget back
        await editCustomApp({
            credentials: nuggetTestUser,
            id: customAppIdWithNuggets,
            nugget: [nuggetId],
        });
        await libraryPage.refresh();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        // check inherited message
        await since('3 Add nugget back, knowledge section should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getKnowledgeContainerDescriptionTitle())
            .toBe(consts.inheritedMessageTitle);
        // decertify nugget
        await certifyNugget({ nuggetId: nuggetId, credentials: nuggetTestUser, certify: false });
        await libraryPage.editBotByUrl({ appId: customAppIdWithNuggets, botId });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        // check inherited message
        await since('4 Uncertify nugget, knowledge section should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getKnowledgeContainerDescriptionTitle())
            .toBe(consts.inheritedMessageTitle);
        await aibotChatPanel.goToLibrary();
    });

    it('[TC94095_02] test i18n', async () => {
        // change user locale to Chinese
        await setUserLanguage({
            baseUrl: urlParser(browser.options.baseUrl),
            userId: consts.nuggetTesti18nUser.id,
            adminCredentials: consts.nuggetTesti18nUser,
            localeId: consts.languageIdMap.ChineseSimplified,
        });
        await libraryPage.switchUser(consts.nuggetTesti18nUser);
        await libraryPage.editBotByUrl({
            appId: customAppIdWithNuggets,
            botId,
        });
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
        await botAuthoring.custommizationPanel.scrollToBottom();
        await since('Inherited message under Chinese should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getKnowledgeContainerDescriptionTitle())
            .toBe(inheritedMessageTitleInChinese);
        await since('Inherited message under Chinese should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getKnowledgeContainerDescriptionMessage())
            .toBe(inheritedMessageInChinese);
    });

    it('[TC94096_02] sanity check app level nugget can be hit', async () => {
        // check custom app with nuggets
        await libraryPage.openBotById({ appId: customAppIdWithNuggets, botId });
        // ask question that is relevant with nugget
        await aibotChatPanel.askQuestion(question);
        // check answer
        await since('When app level nugget is applied, answer should contain #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getAnswersTextByIndex(0))
            .toContain('25.13%');
        // switch to custom app without app level nuggets
        await userAccount.switchCustomApp(customAppWithoutNuggets);
        await libraryPage.openDossier(botName);
        await dossierPage.waitForDossierLoading();
        await aibotChatPanel.clearHistoryAndAskQuestion(question);
        await aibotChatPanel.closeDidYouMean();
        // check answer
        await since(
            'After switch to application without app level nuggets, answer should not contain #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.getAnswersTextByIndex(0))
            .toContain('$1,953');
    });
});
