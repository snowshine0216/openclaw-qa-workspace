import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/teams.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { getBotAsHomeCustomAppObjByBotId } from '../../../constants/customApp/info.js';
import { createBotByAPI, editBotAPI, publishBotByAPI } from '../../../api/bot/index.js';
import { getBotObjectToCreate, getBotObjectToEdit } from '../../../constants/bot.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import deleteCustomAppByNames from '../../../api/customApp/deleteCustomAppByNames.js';

describe('Bot interface in Teams', () => {
    let {
        contentDiscovery,
        libraryPage,
        userAccount,
        libraryAuthoringPage,
        librarySort,
        dossierPage,
        quickSearch,
        fullSearch,
        infoWindow,
        libraryFilter,
        aibotSnapshotsPanel,
        aibotChatPanel,
        mainTeams,
        teamsDesktop,
        sidebar,
    } = browsers.pageObj1;

    let botNotInLibrary = 'F40341_BotNotInLibrary1',
        botNotInLibraryId,
        botNotInLibraryAsHomeAppName = ' --F40341_BotNotInLibrary1',
        customAppIdOfBotNotInLibrary,
        botInLibrary = 'F40341_Bot1',
        botInLibraryId,
        botInLibraryAsHomeAppName = ' --F40341_Bot1',
        customAppIdOfBotInLibrary,
        botWithoutAccess = 'botWithoutAccess1',
        botWithoutAccessId,
        botWithoutAccessAsHomeAppName = ' --botWithoutAccess1',
        customAppIdOfBotWithoutAccess,
        deletedBot = 'deletedBot1',
        deletedBotId,
        deletedBotAsHomeAppName = ' --deletedBot1',
        customAppIdOfDeletedBot,
        inactiveBot = 'inactiveBot1',
        inactiveBotId,
        inactiveBotAsHomeAppName = ' --inactiveBot1',
        customAppIdOfInactiveBot,
        cubeNotPublishedBotAsHomeAppName = ' --cubeNotPublishedBot1',
        customAppIdOfCubeNotPublishedBot;

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
            namesToFind: [
                ' --F40341_BotNotInLibrary1',
                ' --F40341_Bot1',
                ' --botWithoutAccess1',
                ' --deletedBot1',
                ' --inactiveBot1',
                ' --cubeNotPublishedBot1',
            ],
            exactMatch: false,
        });
        // 1.create bot not in library
        let botNotInLibraryBody = getBotObjectToCreate({ botName: botNotInLibrary, folderId: consts.folderId });
        botNotInLibraryId = await createBotByAPI({
            credentials: consts.mstrUser.credentials,
            botInfo: botNotInLibraryBody,
        });
        // modify
        const botObjToEdit = getBotObjectToEdit({ id: botNotInLibraryId, folderId: consts.folderId });
        botObjToEdit.configuration.general.name = consts.bot.modifiedName;
        botObjToEdit.configuration.general.greeting = consts.bot.modifiedGreeting;
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: botObjToEdit });
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
        const botInLibraryBody = getBotObjectToCreate({ botName: botInLibrary, folderId: consts.folderId });
        botInLibraryId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: botInLibraryBody });
        // publish to library
        consts.publishInfo.id = botInLibraryId;
        await publishBotByAPI({
            credentials: consts.mstrUser.credentials,
            publishInfo: consts.publishInfo,
        });
        const botInLibraryAsHomeAppBody = getBotAsHomeCustomAppObjByBotId({
            name: botInLibraryAsHomeAppName,
            botId: botInLibraryId,
        });
        customAppIdOfBotInLibrary = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: botInLibraryAsHomeAppBody,
        });
        await mainTeams.switchToAppInSidebar('Teams');
    });

    beforeEach(async () => {
        await teamsDesktop.switchToActiveWindow();
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
    });

    afterEach(async () => {
        if (await contentDiscovery.getContentDiscoveryPanelDetailPanel().isDisplayed()) {
            await sidebar.clickAllSection();
        }
        await mainTeams.switchToAppInSidebar('Teams');
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdOfBotNotInLibrary,
                customAppIdOfBotInLibrary,
                customAppIdOfBotWithoutAccess,
                customAppIdOfDeletedBot,
                customAppIdOfInactiveBot,
                customAppIdOfCubeNotPublishedBot,
            ],
        });
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [botNotInLibraryId, botInLibraryId, botWithoutAccessId, inactiveBotId],
        });
    });

    it('[TC92868_01] Enable bot in Teams', async () => {
        // no edit button
        await since('1Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateNewButtonPresent())
            .toBe(false);
        // content discovery
        await libraryPage.openSidebarOnly();
        await libraryPage.sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject('MicroStrategy Tutorial');
        await contentDiscovery.openFolderByPath(['Shared Reports', 'Automation', 'Teams']);
        await contentDiscovery.openInfoWindowInTeams(botInLibrary);
        await since('1Existence of favorite icon should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.getFavoriteButtonInInfoWindow().isDisplayed())
            .toBe(true);
        await since('2Existence of share icon should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.getShareButtonInInfoWindow().isDisplayed())
            .toBe(true);
        await since('3Existence of embed icon should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.getEmbeddedBotButtonInInfoWindow().isDisplayed())
            .toBe(false);
        await since('4Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.getEditButtonInInfoWindow().isDisplayed())
            .toBe(false);
        await since('5Existence of manage access icon should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.getManageAccessButtonInInfoWindow().isDisplayed())
            .toBe(false);
        await since('6Existence of active icon should be #{expected}, instead we have #{actual}')
            .expect(await contentDiscovery.getBotActiveSwitchInInfoWindow().isDisplayed())
            .toBe(false);
        // check filter panel
        await libraryPage.sidebar.clickAllSection();
        await libraryPage.closeSidebar();
        await libraryFilter.changeTypesTo('Bot');
        await since('7Exsitence of dossier should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getItem('F40341_Dossier').isDisplayed())
            .toBe(false);
        await libraryFilter.clearTypesSelection();
        // global search
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('F40341');
        await fullSearch.clickMyLibraryTab();
        await fullSearch.waitForElementVisible(fullSearch.getResultItemByName(botInLibrary));
        await fullSearch.openInfoWindow(botInLibrary);
        await since(
            '8Open info window on My Library tab, action buttons count should #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(3);
        await since('9Existence of favorite icon should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.getFavoriteButton().isDisplayed())
            .toBe(true);
        await since('10Existence of share icon should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.getShareButton().isDisplayed())
            .toBe(true);
        await since('11Existence of delete icon should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.getRemoveButton().isDisplayed())
            .toBe(true);
        await fullSearch.sleep(500);
        await fullSearch.clickAllTab();
        await fullSearch.openInfoWindow(botNotInLibrary);
        await since(
            '12Open info window on All Library tab, action buttons count should #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(1);
        await since('13Existence of share icon should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.getShareButton().isDisplayed())
            .toBe(true);
        await fullSearch.closeInfoWindow();
        // open bot
        await fullSearch.openDossierFromSearchResults(botNotInLibrary);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await aibotChatPanel.clickOpenSnapshotPanelButtonInResponsive();
        await since('14Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await since('15Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('16Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        // copy button
        await aibotChatPanel.askQuestionInTeams(consts.question);
        await since('17Existence of copy icon should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.checkIfAnyCopyScreenshotButtonExisting())
            .toBe(false);
        await aibotChatPanel.hoverNthChatAnswerFromEndtoAddSnapshot(1);
        await aibotChatPanel.openSnapshot();
        // await dossierPage.sleep(1000);
        await since('18Existence of copy icon in snapshot should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.checkIfAnyCopyScreenshotButtonExisting())
            .toBe(false);
        await aibotSnapshotsPanel.clickMaximizeButton();
        await since('19Existence of copy icon in maximized snapshot should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.checkIfAnyCopyScreenshotButtonExisting())
            .toBe(false);
    });

    it('[TC92868_02] Bot as home in Teams', async () => {
        // switch to bot as home app
        await userAccount.switchCustomApp(botNotInLibraryAsHomeAppName);
        await dossierPage.waitForDossierLoading();
        // check functions
        await since('Run bot as home in Teams, error should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isErrorPresent())
            .toBe(false);
        await since('Run bot as home in Teams, the toolbar display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await since('Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateNewButtonPresent())
            .toBe(false);
        await since('Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        await since('Add to library button display should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(consts.bot.modifiedName);
        await aibotChatPanel.clearHistory();
        await since('Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(consts.bot.modifiedGreeting);
    });

    it('[TC92868_03] Error handling of bot in Teams', async () => {
        // 3.create bot, create bot as home app, remove access
        const botWithoutAccessBody = getBotObjectToCreate({ botName: botWithoutAccess, folderId: consts.folderId });
        botWithoutAccessId = await createBotByAPI({
            credentials: consts.mstrUser.credentials,
            botInfo: botWithoutAccessBody,
        });
        const botWithoutAccessAsHomeAppBody = getBotAsHomeCustomAppObjByBotId({
            name: botWithoutAccessAsHomeAppName,
            botId: botWithoutAccessId,
        });
        customAppIdOfBotWithoutAccess = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: botWithoutAccessAsHomeAppBody,
        });
        // remove access
        await setObjectAcl({
            credentials: consts.mstrUser.credentials,
            object: {
                id: botWithoutAccessId,
                name: botWithoutAccess,
                project: consts.project,
            },
            acl: [
                {
                    value: 'Denied All',
                    id: consts.botInTeamsUser.id,
                    name: consts.botInTeamsUser.credentials.username,
                },
            ],
        });
        // 4.create bot, create bot as home app, delete bot
        const deletedBotBody = getBotObjectToCreate({ botName: deletedBot, folderId: consts.folderId });
        deletedBotId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: deletedBotBody });
        const deletedBotAsHomeAppBody = getBotAsHomeCustomAppObjByBotId({
            name: deletedBotAsHomeAppName,
            botId: deletedBotId,
        });
        customAppIdOfDeletedBot = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: deletedBotAsHomeAppBody,
        });
        // delete bot
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [deletedBotId],
        });
        // 5.create bot, create bot as home app, change to inactive
        let inactiveBotBody = getBotObjectToCreate({ botName: inactiveBot, folderId: consts.folderId });
        inactiveBotId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody });
        const inactiveBotAsHomeAppBody = getBotAsHomeCustomAppObjByBotId({
            name: inactiveBotAsHomeAppName,
            botId: inactiveBotId,
        });
        customAppIdOfInactiveBot = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: inactiveBotAsHomeAppBody,
        });
        // change to inactive
        inactiveBotBody = getBotObjectToEdit({ id: inactiveBotId, active: false, folderId: consts.folderId });
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody });
        // 6.create custom app with cube not published bot
        const cubeNotPublishedBotAsHomeAppBody = getBotAsHomeCustomAppObjByBotId({
            name: cubeNotPublishedBotAsHomeAppName,
            botId: consts.cubeNotPublishedBot.id,
        });
        customAppIdOfCubeNotPublishedBot = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: cubeNotPublishedBotAsHomeAppBody,
        });
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.switchToAppInSidebar(consts.teamsApp);
        await infoWindow.waitForInfoIconAppear();
        await libraryPage.openSidebarOnly();
        await libraryPage.sidebar.clickAllSection();
        await libraryPage.closeSidebar();
        // 1.open cube not published bot
        await libraryPage.openDossierNoWait(consts.cubeNotPublishedBot.name);
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('The error message of not published bot should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.cubeNotPublishedErrorMessage);
        await libraryPage.dismissError();
        // verify back to library home
        await since('Existence of sort box should be #{expected}, instead we have #{actual}')
            .expect(await librarySort.getSortBox().isDisplayed())
            .toBe(true);
        // 2.inactive bot
        await userAccount.switchCustomApp(inactiveBot);
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('The error message of inactive bot should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.inactiveBotErrorMessage);
        await libraryPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92868_03_01', 'inline error of inactive bot');
        // 3.open bot without access
        await userAccount.switchCustomApp(botWithoutAccess);
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('The error message of no user privilege should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.noAccessErrorMessage);
        await libraryPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92868_03_02', 'inline error of no access bot');
        // 4.switch to bot as home, bot is deleted
        await userAccount.switchCustomApp(deletedBotAsHomeAppName);
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('The error message of deleted bot should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.deletedErrorMessage);
        await libraryPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92868_03_03', 'inline error of deleted bot');
    });
});
