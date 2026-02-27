import teamsLogin from '../../../api/teams/teamsLogin.js';
import teamsLogout from '../../../api/teams/teamsLogout.js';
import * as consts from '../../../constants/teams.js';
import { deleteAllTabsInChannel } from '../../../api/teams/deleteTabInChannel.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { getBotAsHomeCustomAppObjByBotId } from '../../../constants/customApp/info.js';
import { createBotByAPI, editBotAPI, publishBotByAPI } from '../../../api/bot/index.js';
import { getBotObjectToCreate, getBotObjectToEdit } from '../../../constants/bot.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import deleteCustomAppByNames from '../../../api/customApp/deleteCustomAppByNames.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Share Bot in Web Teams', () => {
    let {
        loginPage,
        share,
        infoWindow,
        libraryPage,
        dossierPage,
        mainTeams,
        userAccount,
        modalDialog,
        shareInTeamsDialog,
        aibotChatPanel,
        conversation,
        pinFromChannel,
        apps,
    } = browsers.pageObj1;
    let botNotInLibrary = 'F40341_BotNotInLibrary3',
        botNotInLibraryId,
        botNotInLibraryAsHomeAppName = ' --F40341_BotNotInLibrary3',
        customAppIdOfBotNotInLibrary,
        botInLibrary = 'F40341_Bot3',
        botInLibraryId;
    const channels = {
        share: consts.shareChannel,
    };

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.security });
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.all_security });
        // 0.delete existing custom app
        await deleteCustomAppByNames({
            credentials: consts.mstrUser.credentials,
            namesToFind: [' --F40341_BotNotInLibrary3'],
            exactMatch: false,
        });
        // delete all tabs
        const accessToken = await teamsLogin({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
        });
        for (const key in channels) {
            await deleteAllTabsInChannel({
                accessToken: accessToken,
                teamId: browsers.params.teamId,
                channelName: channels[key],
            });
        }
        await teamsLogout({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
            accessToken: accessToken,
        });
        // 1.create bot not in library
        let botNotInLibraryBody = getBotObjectToCreate({ botName: botNotInLibrary, folderId: consts.folderId });
        botNotInLibraryId = await createBotByAPI({
            credentials: consts.mstrUser.credentials,
            botInfo: botNotInLibraryBody,
        });
        // modify
        botNotInLibraryBody = getBotObjectToEdit({ id: botNotInLibraryId, folderId: consts.folderId });
        botNotInLibraryBody.configuration.general.name = consts.bot.modifiedName;
        botNotInLibraryBody.configuration.general.greeting = consts.bot.modifiedGreeting;
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: botNotInLibraryBody });
        // create bot as home app
        const botNotInLibraryAsHomeAppBody = getBotAsHomeCustomAppObjByBotId({
            name: botNotInLibraryAsHomeAppName,
            botId: botNotInLibraryId,
        });
        customAppIdOfBotNotInLibrary = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: botNotInLibraryAsHomeAppBody,
        });
        // 2.create bot in library
        let botInLibraryBody = getBotObjectToCreate({ botName: botInLibrary, folderId: consts.folderId });
        botInLibraryId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: botInLibraryBody });
        // publish to library
        consts.publishInfo.id = botInLibraryId;
        await publishBotByAPI({
            credentials: consts.mstrUser.credentials,
            publishInfo: consts.publishInfo,
        });
        // modify
        botInLibraryBody = getBotObjectToEdit({ id: botInLibraryId, folderId: consts.folderId });
        botInLibraryBody.configuration.general.name = consts.bot.modifiedName;
        botInLibraryBody.configuration.general.greeting = consts.bot.modifiedGreeting;
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: botInLibraryBody });
        await apps.openTeamsApp(consts.teamsApp);
    });

    afterEach(async () => {
        await dossierPage.closeTab(1);
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.waitForTeamsView();
    });

    afterAll(async () => {
        await mainTeams.switchToAppInSidebar('Teams');
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdOfBotNotInLibrary],
        });
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [botNotInLibraryId, botInLibraryId],
        });
        // delete all tabs
        const accessToken = await teamsLogin({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
        });
        for (const key in channels) {
            await deleteAllTabsInChannel({
                accessToken: accessToken,
                teamId: browsers.params.teamId,
                channelName: channels[key],
            });
        }
        await teamsLogout({
            clientId: browsers.params.clientId,
            tenantId: browsers.params.tenantId,
            clientSecret: browsers.params.clientSecret,
            accessToken: accessToken,
        });
    });

    it('[TC92863_01] Share bot from bot context menu', async () => {
        // switch to pinned app
        await infoWindow.waitForInfoIconAppear();
        // open context menu
        await libraryPage.openDossierContextMenu(botInLibrary);
        await libraryPage.clickDossierContextMenuItem('Share', 'Share in Teams');
        // switch to iframe
        await browser.switchToFrame(null);
        await shareInTeamsDialog.shareToReceipientInTeams({
            receipient: consts.receipient.credentials.name,
            text: consts.sharedMessage,
        });
        await shareInTeamsDialog.viewSharedMessage();
        // verify link
        const link = await conversation.getLinkInLatestMessage();
        await since('Shared message should be #{expected}, instead we have #{actual}.')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.sharedMessage + '\n\n' + link);
        await libraryPage.switchToNewWindowWithLink(link);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        // receipient login in library
        await loginToWeb(link);
        await since('Run bot from shared link, error should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await since('Run bot from shared link, the toolbar display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(consts.bot.modifiedName);
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(consts.bot.modifiedGreeting);
    });

    it('[TC92863_02] Share bot from share panel, bot as home', async () => {
        await apps.openTeamsApp(consts.teamsApp);
        // switch to pinned app
        await infoWindow.waitForInfoIconAppear();
        // switch to bot as home app
        await userAccount.switchCustomApp(botNotInLibraryAsHomeAppName);
        await dossierPage.waitForDossierLoading();
        await share.clickShareInTeams();
        // switch to iframe
        await browser.switchToFrame(null);
        await shareInTeamsDialog.shareToReceipientInTeams({
            receipient: consts.receipient.credentials.name,
            text: consts.sharedMessage,
        });
        await shareInTeamsDialog.viewSharedMessage();
        // verify link
        const link = await conversation.getLinkInLatestMessage();
        await since('Shared message should be #{expected}, instead we have #{actual}.')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.sharedMessage + '\n\n' + link);
        await libraryPage.switchToNewWindowWithLink(link);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        // receipient login in library
        await loginToWeb(link);
        // randomly, project is locked error appears
        if (dossierPage.isErrorPresent()) {
            await browser.refresh();
            await dossierPage.waitForDossierLoading();
        }
        await since('Run bot from shared link, error should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await since('Run bot from shared link, the toolbar display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(consts.bot.modifiedName);
    });

    it('[TC92863_03] Share bot from pinned bot', async () => {
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 1600,
            height: 1200,
        });
        // pin bot firstly
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel: consts.shareChannel });
        await pinFromChannel.pinNewDossierFromChannel(consts.teamsApp);
        await modalDialog.switchToLibraryIframe();
        await modalDialog.chooseDossierAndSave(botInLibrary);
        await browser.switchToFrame(null);
        if (!(await conversation.isTabExist(botInLibrary))) {
            await browser.refresh();
            await mainTeams.switchToTeamsChannel({ team: consts.team, channel: consts.shareChannel });
            await conversation.chooseTab(botInLibrary);
        }
        await mainTeams.switchToLibraryIframe();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await share.clickShareInTeams();
        // switch to iframe
        await browser.switchToFrame(null);
        await shareInTeamsDialog.shareToReceipientInTeams({
            receipient: consts.receipient.credentials.name,
            text: consts.sharedMessage,
        });
        await shareInTeamsDialog.viewSharedMessage();
        // verify link
        const link = await conversation.getLinkInLatestMessage();
        await since('Shared message should be #{expected}, instead we have #{actual}.')
            .expect(await conversation.getTextInLatestMessage())
            .toBe(consts.sharedMessage + '\n\n' + link);
        await libraryPage.switchToNewWindowWithLink(link);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        // receipient login in library
        await loginToWeb(link);
        await since('Run bot from shared link, error should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await since('Run bot from shared link, the toolbar display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(consts.bot.modifiedName);
    });

    async function loginToWeb(link) {
        if (await loginPage.getUsernameForm().isDisplayed()) {
            await loginPage.login(consts.receipient.credentials);
            await dossierPage.waitForDossierLoading();
        } else {
            await libraryPage.openUserAccountMenu();
            await libraryPage.logout();
            await loginPage.login(consts.receipient.credentials);
            await browser.url(link);
            await dossierPage.waitForDossierLoading();
        }
    }
});
