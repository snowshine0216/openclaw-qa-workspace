import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import teamsLogin from '../../../api/teams/teamsLogin.js';
import teamsLogout from '../../../api/teams/teamsLogout.js';
import { deleteAllTabsInChannel } from '../../../api/teams/deleteTabInChannel.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/teams.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { getBotAsHomeCustomAppObjByBotId } from '../../../constants/customApp/info.js';
import { createBotByAPI, editBotAPI, publishBotByAPI } from '../../../api/bot/index.js';
import { getBotObjectToCreate, getBotObjectToEdit } from '../../../constants/bot.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import deleteCustomAppByNames from '../../../api/customApp/deleteCustomAppByNames.js';

describe('Pin Bot to Teams Channel', () => {
    let {
        azureLoginPage,
        userAccount,
        infoWindow,
        libraryPage,
        share,
        aibotSnapshotsPanel,
        teamsDesktop,
        aibotChatPanel,
        dossierPage,
        mainTeams,
        modalDialog,
        pinFromChannel,
        conversation,
    } = browsers.pageObj1;
    let botNotInLibrary = 'F40341_BotNotInLibrary2',
        botNotInLibraryId,
        botNotInLibraryAsHomeAppName = ' --F40341_BotNotInLibrary2',
        botNotInLibraryAsHomeApp2Name = 'Micro_BotNotInLibrary1',
        customAppIdOfBotNotInLibrary,
        customAppIdOfBotNotInLibrary2,
        botInLibrary = 'F40341_Bot2',
        botInLibraryId,
        botWithoutAccess = 'botWithoutAccess2',
        botWithoutAccessId,
        deletedBot = 'deletedBot2',
        deletedBotId,
        inactiveBot = 'inactiveBot2',
        inactiveBotId;
    const channels = {
        general: 'General',
        context: consts.pinFromContextMenuChannel,
        share: consts.longNameChannel,
        pin: consts.pinFromPinnedObjectChannel,
        error: consts.errorChannel,
    };

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.security });
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.all_security });
        await teamsDesktop.switchToActiveWindow();
        const isCurrentUser = await teamsDesktop.checkCurrentTeamsUser(consts.botInTeamsUser.credentials.username);
        if (!isCurrentUser) {
            await teamsDesktop.switchToTeamsUser(consts.botInTeamsUser.credentials.username);
        }
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        // 0.delete existing custom app
        await deleteCustomAppByNames({
            credentials: consts.mstrUser.credentials,
            namesToFind: [' --F40341_BotNotInLibrary2', 'Micro_BotNotInLibrary1'],
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
        // create bot as home app 1
        const botNotInLibraryAsHomeAppBody = getBotAsHomeCustomAppObjByBotId({
            name: botNotInLibraryAsHomeAppName,
            botId: botNotInLibraryId,
        });
        customAppIdOfBotNotInLibrary = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: botNotInLibraryAsHomeAppBody,
        });
        // create bot as home app 2
        const botNotInLibraryAsHomeApp2Body = getBotAsHomeCustomAppObjByBotId({
            name: botNotInLibraryAsHomeApp2Name,
            botId: botNotInLibraryId,
        });
        customAppIdOfBotNotInLibrary2 = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: botNotInLibraryAsHomeApp2Body,
        });
        // 2.create bot in library
        let botInLibraryBody = getBotObjectToCreate({ botName: botInLibrary, folderId: consts.folderId });
        botInLibraryId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: botInLibraryBody });
        botInLibraryBody = getBotObjectToEdit({ id: botInLibraryId, folderId: consts.folderId });
        botInLibraryBody.configuration.general.name = consts.bot.modifiedName;
        botInLibraryBody.configuration.general.greeting = consts.bot.modifiedGreeting;
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: botInLibraryBody });
        // publish to library
        consts.publishInfo.id = botInLibraryId;
        await publishBotByAPI({
            credentials: consts.mstrUser.credentials,
            publishInfo: consts.publishInfo,
        });
        await mainTeams.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await mainTeams.switchToAppInSidebar('Chat');
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [customAppIdOfBotNotInLibrary, customAppIdOfBotNotInLibrary2],
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
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [botNotInLibraryId, botInLibraryId, inactiveBotId, botWithoutAccessId, deletedBotId],
        });
    });

    it('[TC92802_01] Verify copy button in pinned bot', async () => {
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.switchToChannel('General');
        await pinFromChannel.pinNewDossierFromChannel(consts.teamsApp);
        await modalDialog.switchToLibraryIframe();
        await modalDialog.chooseDossierAndSave(botInLibrary);
        await modalDialog.switchToLibraryIframe();
        await aibotChatPanel.askQuestionInTeams(consts.question);
        await aibotChatPanel.clickOpenSnapshotPanelButtonInResponsive();
        await since('Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(false);
        // copy button
        await since('Existence of copy icon should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.checkIfAnyCopyScreenshotButtonExisting())
            .toBe(false);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await since('Existence of copy icon should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.checkIfAnyCopyScreenshotButtonExisting())
            .toBe(false);
        await aibotSnapshotsPanel.clickMaximizeButton();
        await since('Existence of copy icon should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.checkIfAnyCopyScreenshotButtonExisting())
            .toBe(false);
    });

    it('[TC92802_02] Verify pin bot from share panel, custom app, bot not in library', async () => {
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await userAccount.switchCustomApp('--F40341_BotNotInLibrary2');
        await dossierPage.waitForDossierLoading();
        await share.clickPinInTeams();
        await loginToTeams();
        await share.waitForElementVisible(await share.getPinInTeamsDialog());
        await share.selectChannelToPinBot({ team: consts.team, channel: consts.longNameChannel });
        // dismiss cursor in input box
        await share.dismissCursorInSelector();
        await takeScreenshotByElement(
            share.getContentInPinInTeamsDialog(),
            'TC92802_02_01',
            'UI of Pin in Teams dialog'
        );
        await share.pinBot();
        await share.viewPinnedObjectInTab();
        await waitForPinnedTabAppear(botNotInLibrary);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await since('Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(false);
    });

    it('[TC92802_03] Verify pin bot from context menu', async () => {
        // default app, bot in library
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openDossierContextMenu(botInLibrary);
        await libraryPage.clickDossierContextMenuItem('Share', 'Pin in Teams');
        await loginToTeams();
        await share.waitForElementVisible(await share.getPinInTeamsDialog());
        await share.selectChannelToPinBot({ team: consts.team, channel: consts.pinFromContextMenuChannel });
        await share.pinBot();
        await share.viewPinnedObjectInTab();
        await waitForPinnedTabAppear(botInLibrary);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await since('Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(false);
    });

    it('[TC92802_04] Verify pin bot from pinned bot', async () => {
        // default app, bot not in library
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.switchToChannel('General');
        // pin from channel first
        await pinFromChannel.pinNewDossierFromChannel(consts.teamsApp);
        await modalDialog.switchToLibraryIframe();
        await modalDialog.chooseDossierAndSave(botInLibrary);
        await mainTeams.switchToLibraryIframe();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        // pin bot from share panel of pinned bot
        await share.clickPinInTeams();
        await loginToTeams();
        await share.waitForElementVisible(await share.getPinInTeamsDialog());
        await share.selectChannelToPinBot({ team: consts.team, channel: consts.pinFromPinnedObjectChannel });
        await share.pinBot();
        await share.viewPinnedObjectInTab();
        await waitForPinnedTabAppear(botInLibrary);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await since('Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(false);
    });

    it('[TC92802_05] Verify function of pin bot from channel', async () => {
        // custom app, bot not in library
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel: 'General' });
        await pinFromChannel.pinNewDossierFromChannel(consts.teamsApp);
        await modalDialog.switchToLibraryIframe();
        // test search
        await modalDialog.searchObject('F40341_');
        await modalDialog.changeTabInSearchResult('All');
        await since('Exsitence of dossier not in library should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier(consts.dossierNotInLibrary.name).isDisplayed())
            .toBe(true);
        await since('Exsitence of bot not in library should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier(botNotInLibrary).isDisplayed())
            .toBe(true);
        await modalDialog.back();
        // switch to bot as home app, bot not in library, no type and search
        await modalDialog.switchToApp(botNotInLibraryAsHomeApp2Name);
        await since('Existence of type should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getTypeDropdownList().isDisplayed())
            .toBe(false);
        await since('Existence of search icon should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getSearchBox().isDisplayed())
            .toBe(false);
        await since('Count should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getObjectCount())
            .toBe('All (1)');
        await modalDialog.chooseDossierAndSave(botNotInLibrary);
        await mainTeams.switchToLibraryIframe();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await since('Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(false);
    });

    it('[TC92802_06] Error handling', async () => {
        // 3.create bot
        const botWithoutAccessBody = getBotObjectToCreate({ botName: botWithoutAccess, folderId: consts.folderId });
        botWithoutAccessId = await createBotByAPI({
            credentials: consts.mstrUser.credentials,
            botInfo: botWithoutAccessBody,
        });

        // 4.create bot
        const deletedBotBody = getBotObjectToCreate({ botName: deletedBot, folderId: consts.folderId });
        deletedBotId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: deletedBotBody });

        // 5.create bot, pin, change to inactive
        let inactiveBotBody = getBotObjectToCreate({ botName: inactiveBot, folderId: consts.folderId });
        inactiveBotId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody });

        // pin 4 bots
        await teamsDesktop.switchToActiveWindow();
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel: consts.errorChannel });
        const botList = [botWithoutAccess, deletedBot, inactiveBot, consts.cubeNotPublishedBot.name];
        for (let bot of botList) {
            await pinFromChannel.pinNewDossierFromChannel(consts.teamsApp);
            if (bot === botWithoutAccess) {
                await modalDialog.switchToLibraryIframe();
            } else {
                await modalDialog.switchToModalIframe();
            }
            await modalDialog.searchObject(bot);
            await modalDialog.changeTabInSearchResult('All');
            await modalDialog.chooseDossierAndSave(bot);
            await mainTeams.switchToLibraryIframe();
            await dossierPage.waitForDossierLoading();
            await browser.switchToFrame(null);
        }
        // remove access
        await setObjectAcl({
            credentials: consts.mstrUser.credentials,
            object: { id: botWithoutAccessId, name: botWithoutAccess, project: consts.project },
            acl: [
                {
                    value: 'Custom',
                    id: consts.botInTeamsUser.id,
                    name: consts.botInTeamsUser.credentials.username,
                    denyRights: 254,
                    rights: 1,
                },
            ],
        });
        // delete bot
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [deletedBotId],
        });
        // change to inactive
        inactiveBotBody = getBotObjectToEdit({ id: inactiveBotId, active: false, folderId: consts.folderId });
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody });
        await teamsDesktop.switchToActiveWindow();
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel: consts.errorChannel });
        // 1. pinned bot is inactive
        await browser.switchToFrame(null);
        await conversation.chooseTab(inactiveBot);
        await modalDialog.switchToLibraryIframe();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_01', 'inactive bot');
        await dossierPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_02', 'Inactive bot inline error');
        // 2. pinned bot is deleted
        await browser.switchToFrame(null);
        await conversation.chooseTab(deletedBot);
        await modalDialog.switchToLibraryIframe();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_03', 'Bot is deleted');
        await dossierPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_04', 'Bot is deleted inline error');
        // 3.no execute access to bot
        await browser.switchToFrame(null);
        await conversation.chooseTab(botWithoutAccess);
        await modalDialog.switchToLibraryIframe();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_05', 'No access');
        await dossierPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_06', 'No execute access inline error');
        // 4.cube not publish
        await browser.switchToFrame(null);
        await conversation.chooseTab(consts.cubeNotPublishedBot.name);
        await modalDialog.switchToLibraryIframe();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_07', 'Cube not publish');
        await dossierPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92802_06_08', 'Cube not publish inline error');
    });

    async function waitForPinnedTabAppear(tab) {
        await browser.switchToFrame(null);
        await mainTeams.sleep(1000);
        if (await mainTeams.getErrorMessageDuringPin().isDisplayed()) {
            console.log('Error appear during pin');
            await mainTeams.dismissErrorMessageDuringPin();
            await mainTeams.waitForTeamsView();
        }
        await conversation.chooseTab(tab);
        await modalDialog.switchToLibraryIframe();
    }

    async function loginToTeams() {
        let windowNumber = (await teamsDesktop.getBrowserTabs()).length;
        if (await teamsDesktop.isPopUpLoginPageExisting(windowNumber)) {
            await teamsDesktop.switchToNewWindow();
            await azureLoginPage.loginWithPassword(consts.botInTeamsUser.credentials.password);
            await azureLoginPage.safeContinueAzureLogin();
            await teamsDesktop.switchToActiveWindow();
            await teamsDesktop.switchToLibraryIframe();
        }
    }
});
