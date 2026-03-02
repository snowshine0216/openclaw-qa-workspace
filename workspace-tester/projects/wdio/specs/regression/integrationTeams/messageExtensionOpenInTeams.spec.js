import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/teams.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, editBotAPI, publishBotByAPI } from '../../../api/bot/index.js';
import { getBotObjectToCreate, getBotObjectToEdit } from '../../../constants/bot.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import { randomString, getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteCustomAppByNames from '../../../api/customApp/deleteCustomAppByNames.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';

describe('message extension_open in teams', () => {
    let {
        libraryPage,
        userAccount,
        dossierPage,
        modalDialog,
        aibotChatPanel,
        mainTeams,
        teamsDesktop,
        messageExtension,
        conversation,
    } = browsers.pageObj1;

    let botNotInLibrary = 'F40482_BotNotInLibrary1',
        botNotInLibraryId,
        botNotInLibraryAsHomeAppName = 'Micro_BotNotInLibrary2',
        customAppIdOfBotNotInLibrary,
        botInLibrary = 'F40482_Bot1',
        botInLibraryId,
        botWithoutAccess = 'botWithoutAccess3',
        botWithoutAccessId,
        deletedBot = 'deletedBot3',
        deletedBotId,
        inactiveBot = 'inactiveBot3',
        inactiveBotId,
        inactiveBot2 = 'Auto_Inactive_Bot',
        inactiveBotId2,
        dossierInLibraryAsHomeAppName = 'Micro_DossierAsHome',
        customAppIdOfDossierInLibrary,
        libraryAsHomeAppWithContentGroup = 'Micro_LibraryAsHome',
        libraryAsHomeAppId,
        contentGroup = 'contentGroupTeams_loooooooooongName' + randomString(4),
        contentGroupId,
        botWithoutAccessAppName = 'Micro_BotNoAccess',
        customAppIdOfBotWithoutAccess,
        channel = 'MessageExtensionOpenInTeams',
        group = 'Auto_Group1',
        receipient = 'demo';

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.security });
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.all_security });
        // 0. delete existing custom app and content group
        await deleteCustomAppByNames({
            credentials: consts.mstrUser.credentials,
            namesToFind: ['Micro_BotNotInLibrary2', 'Micro_DossierAsHome', 'Micro_LibraryAsHome', 'Micro_BotNoAccess'],
            exactMatch: false,
        });
        await deleteContentGroupsByNames({
            credentials: consts.mstrUser.credentials,
            namesToFind: ['contentGroupTeams_loooooooooongName'],
            exactMatch: false,
        });
        // 1. create bot in library
        const botInLibraryBody = getBotObjectToCreate({ botName: botInLibrary, folderId: consts.folderId });
        botInLibraryId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: botInLibraryBody });
        // publish to library
        consts.publishInfo.id = botInLibraryId;
        await publishBotByAPI({
            credentials: consts.mstrUser.credentials,
            publishInfo: consts.publishInfo,
        });
        // 2. create bot not in library
        const botNotInLibraryBody = getBotObjectToCreate({ botName: botNotInLibrary, folderId: consts.folderId });
        botNotInLibraryId = await createBotByAPI({
            credentials: consts.mstrUser.credentials,
            botInfo: botNotInLibraryBody,
        });
        // modify, use OOTB cover image
        const botObjToEdit = getBotObjectToEdit({ id: botNotInLibraryId, folderId: consts.folderId });
        botObjToEdit.configuration.general.name = consts.bot.modifiedName;
        botObjToEdit.configuration.general.greeting = consts.bot.modifiedGreeting;
        botObjToEdit.configuration.general.coverImageUrl = 'ai-industry/Sports.jpg';
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: botObjToEdit });
        // 3. create bot as home app
        const botNotInLibraryAsHomeAppBody = getCustomAppBody({
            version: 'v6',
            name: botNotInLibraryAsHomeAppName,
            dossierMode: 2,
            url: `app/${consts.project.id}/${botNotInLibraryId}`,
        });
        customAppIdOfBotNotInLibrary = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: botNotInLibraryAsHomeAppBody,
        });
        // 4. create content group: 'F40482_Bot1', 'US Economy Analysis', receipient is bot
        const contentGroupInfo = {
            color: 2276796,
            emailEnabled: true,
            name: contentGroup,
            recipients: [
                {
                    id: consts.botInTeamsUser.id,
                },
            ],
        };
        const contentInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: '/' + consts.project.id,
                    value: [
                        {
                            id: botInLibraryId,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'add',
                    path: '/' + consts.project.id,
                    value: [
                        {
                            id: '19A95FA711EC45A93E0B0080AFAB8FDF',
                            type: 55,
                        },
                    ],
                },
            ],
        };
        contentGroupId = await createContentGroup({
            credentials: consts.mstrUser.credentials,
            contentGroupInfo,
            contentInfo,
        });
        // 5. create library as home app
        const libraryAsHomeAppBody = getCustomAppBody({
            version: 'v6',
            name: libraryAsHomeAppWithContentGroup,
            contentBundleIds: [contentGroupId],
            showAllContents: true,
        });
        libraryAsHomeAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: libraryAsHomeAppBody,
        });
        await teamsDesktop.switchToActiveWindow();
        const isCurrentUser = await teamsDesktop.checkCurrentTeamsUser(consts.botInTeamsUser.credentials.username);
        if (!isCurrentUser) {
            await teamsDesktop.switchToTeamsUser(consts.botInTeamsUser.credentials.username);
        }
    });

    beforeEach(async () => {
        await mainTeams.switchToAppInSidebar('Teams');
    });

    afterEach(async () => {
        await browser.switchToFrame(null);
        const dialog = await modalDialog.getDialog().isDisplayed();
        if (dialog) {
            await modalDialog.closeMessageExtensionDialog();
        }
    });

    afterAll(async () => {
        await mainTeams.switchToAppInSidebar('Teams');
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdOfBotNotInLibrary,
                customAppIdOfDossierInLibrary,
                libraryAsHomeAppId,
                customAppIdOfBotWithoutAccess,
            ],
        });
        await deleteContentGroupsByIds({ credentials: consts.mstrUser.credentials, contentGroupIds: [contentGroupId] });
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [botNotInLibraryId, botInLibraryId, botWithoutAccessId, inactiveBotId],
        });
    });

    it('[TC93976_01] Share bot in channel', async () => {
        // 1. bot not in library, bot as home app
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await messageExtension.shareObjectFromMessageExtension({
            application: botNotInLibraryAsHomeAppName,
            object: botNotInLibrary,
            fromChannel: true,
        });
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getInputBoxInTeams());
        await aibotChatPanel.askQuestionInTeams(consts.question);
        await since('1 Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('2 Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('3 Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        await since('4 Bot name in chat title should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotName().getText())
            .toBe(consts.bot.modifiedName);
        await aibotChatPanel.clearHistory();
        await since('6 Default Greeting message in chat should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(consts.bot.modifiedGreeting);
        // assert custom app app is selected
        await since('7 Custom app is selected should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.isApplicationSelected(botNotInLibraryAsHomeAppName))
            .toBe(true);

        // 2.bot in library, default app
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await messageExtension.shareObjectFromMessageExtension({
            object: botInLibrary,
            fromChannel: true,
        });
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        // assert default app is selected
        await since('8 Default app is selected should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.isApplicationSelected(consts.defaultApp))
            .toBe(true);

        // 3. no access bot, not in library, bot as home app
        const botWithoutAccessBody = getBotObjectToCreate({ botName: botWithoutAccess, folderId: consts.folderId });
        botWithoutAccessId = await createBotByAPI({
            credentials: consts.mstrUser.credentials,
            botInfo: botWithoutAccessBody,
        });
        const botWithoutAccessAppBody = getCustomAppBody({
            version: 'v6',
            name: botWithoutAccessAppName,
            dossierMode: 2,
            url: `app/${consts.project.id}/${botWithoutAccessId}`,
        });
        customAppIdOfBotWithoutAccess = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: botWithoutAccessAppBody,
        });
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await messageExtension.shareObjectFromMessageExtension({
            application: botWithoutAccessAppName,
            object: botWithoutAccess,
            fromChannel: true,
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
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        await since('9 The error message of no access should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.noAccessErrorMessage);
        await libraryPage.dismissError();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC93796_01_01', 'inline error of no access bot');
        // assert custom app is selected
        await since('10 Custom app is selected should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.isApplicationSelected(botWithoutAccessAppName))
            .toBe(true);

        // 4. deleted bot, not in library, library as home app
        const deletedBotBody = getBotObjectToCreate({ botName: deletedBot, folderId: consts.folderId });
        deletedBotId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: deletedBotBody });
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await messageExtension.shareObjectFromMessageExtension({
            object: deletedBot,
            fromChannel: true,
        });
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [deletedBotId],
        });
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('11 The error message of deleted bot should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.deletedErrorMessage);
        await libraryPage.dismissError();

        // 5. create bot, change to inactive
        let inactiveBotBody = getBotObjectToCreate({ botName: inactiveBot, folderId: consts.folderId });
        inactiveBotId = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody });
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await messageExtension.shareObjectFromMessageExtension({
            object: inactiveBot,
            fromChannel: true,
        });
        inactiveBotBody = getBotObjectToEdit({ id: inactiveBotId, active: false, folderId: consts.folderId });
        // change to inactive
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody });
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since('12 The error message of inactive bot should "#{expected}", instead we have "#{actual}"')
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.inactiveBotErrorMessage);
        await libraryPage.dismissError();

        // 6. cube not published bot, in library, library as home app
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await messageExtension.shareObjectFromMessageExtension({
            object: consts.cubeNotPublishedBot.name,
            fromChannel: true,
        });
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since(
            '13 The error message of cube not published privilege should "#{expected}", instead we have "#{actual}"'
        )
            .expect(await dossierPage.errorMsg())
            .toEqual(consts.cubeNotPublishedErrorMessage);
        await libraryPage.dismissError();
        await browser.switchToFrame(null);
        // await conversation.switchToTabInChat('About');
        // await since('14 App details dialog should be #{expected}, instead we have #{actual}')
        //     .expect(await conversation.getAppDetailsDialog().isDisplayed())
        //     .toBe(false);
    });

    it('[TC93976_02] Share dashboard in chat', async () => {
        // 1. dashboard in library, create dashboard as home app
        const dossierInLibraryAsHomeAppBody = getCustomAppBody({
            version: 'v6',
            name: dossierInLibraryAsHomeAppName,
            dossierMode: 1,
            url: `app/${consts.project.id}/${consts.dossier.id}`,
        });
        customAppIdOfDossierInLibrary = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: dossierInLibraryAsHomeAppBody,
        });
        await mainTeams.switchToChat(receipient);
        await messageExtension.shareObjectFromMessageExtension({
            application: dossierInLibraryAsHomeAppName,
            object: consts.dossier.name,
        });
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        await since('1 Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('2 Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('3 Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        // assert custom app is selected
        await since('4 Custom app is selected should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.isApplicationSelected(dossierInLibraryAsHomeAppName))
            .toBe(true);
        // 2. dossier not in library, default app
        await mainTeams.switchToChat(receipient);
        await messageExtension.shareObjectFromMessageExtension({
            object: consts.dossierNotInLibrary.name,
        });
        await conversation.openLatestObjectFromMessageExtensionInTeams();
        await mainTeams.isTeamsAppSelected(consts.teamsApp);
        await mainTeams.waitForObjectLoading();
        await since('5 Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await since('6 Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(false);
        await since('7 Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        // assert default app is selected
        await since('8 Default app is selected should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.isApplicationSelected(consts.defaultApp))
            .toBe(true);
        await browser.switchToFrame(null);
        // await conversation.switchToTabInChat('About');
        // await since('9 App details dialog should be #{expected}, instead we have #{actual}')
        //     .expect(await conversation.getAppDetailsDialog().isDisplayed())
        //     .toBe(false);
    });

    it('[TC93976_03] Test UI of share object from message extenstion in group', async () => {
        // create inactive bot
        let inactiveBotBody2 = getBotObjectToCreate({ botName: inactiveBot2, folderId: consts.folderId });
        inactiveBotId2 = await createBotByAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody2 });
        inactiveBotBody2 = getBotObjectToEdit({ id: inactiveBotId2, active: false, folderId: consts.folderId });
        // change to inactive
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: inactiveBotBody2 });
        // bot as home app, bot not in library
        await mainTeams.switchToChat(group);
        await messageExtension.selectAppInMessageExtension({ appName: consts.teamsApp, fromChannel: false });
        await modalDialog.waitForObjectLoadingInMessageExtension();
        // inactive bot
        await modalDialog.chooseDossier(inactiveBot2);
        await since('1 Share button is disabled should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.isShareButtonDisabled())
            .toBe(true);
        await modalDialog.back();
        // library as home app
        await modalDialog.switchToApp(libraryAsHomeAppWithContentGroup);
        // change to content group
        await modalDialog.changeContentGroup(contentGroup);
        await since('2 Count should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getObjectCount())
            .toBe('All (2)');
        await since('3 Existence of US Economy Analysis should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier('US Economy Analysis').isDisplayed())
            .toBe(true);
        await since('4 Existence of F40482_Bot1 should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier('F40482_Bot1').isDisplayed())
            .toBe(true);
        // change type
        await modalDialog.changeType('Dashboard');
        await takeScreenshotByElement(modalDialog.getObjectList(), 'TC93976_03_03', 'Only US Economy Analysis');
        // search, check content group
        await modalDialog.searchObject('Investment Firm');
        // local search is intersection of content group and type
        await takeScreenshotByElement(modalDialog.getSearchedList(), 'TC93976_03_04', 'Blank list in my library');
        // global search is not affected by content group
        await modalDialog.changeTabInSearchResult('All');
        await since('5 Existence of dashboard should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier('Investment Firm').isDisplayed())
            .toBe(true);
        // search is only affected by type
        await modalDialog.back();
        await modalDialog.searchObject(botNotInLibrary);
        await since('6 Existence of bot should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier(botNotInLibrary).isDisplayed())
            .toBe(false);
        await modalDialog.changeTabInSearchResult('All');
        await since('7 Existence of bot should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier(botNotInLibrary).isDisplayed())
            .toBe(false);
        await modalDialog.back();
        // switch to bot as home app, no content group, type or search
        await modalDialog.switchToApp(botNotInLibraryAsHomeAppName);
        await since('8 Existence of content group should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getContentGroupDropdownList().isDisplayed())
            .toBe(false);
        await since('9 Existence of type should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getTypeDropdownList().isDisplayed())
            .toBe(false);
        await since('10 Existence of search icon should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getSearchIcon().isDisplayed())
            .toBe(false);
        await since('11 Count should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getObjectCount())
            .toBe('All (1)');
        await since('12 Existence of F40482_BotNotInLibrary1 should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier(botNotInLibrary).isDisplayed())
            .toBe(true);
        await modalDialog.closeMessageExtensionDialog();
    });

    it('[TC93976_04] Cover image in shared card, channel', async () => {
        await mainTeams.switchToTeamsChannel({ team: consts.team, channel });
        await messageExtension.shareObjectFromMessageExtension({
            object: botInLibrary,
            fromChannel: true,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93796_04_01',
            'bot default cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            application: botNotInLibraryAsHomeAppName,
            object: botNotInLibrary,
            fromChannel: true,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93796_04_02',
            'bot OOTB cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: consts.cubeNotPublishedBot.name,
            fromChannel: true,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93796_04_03',
            'bot customized cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: 'F40341_Dossier',
            fromChannel: true,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93796_04_04',
            'dossier default cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: 'Investment Firm Dossier',
            fromChannel: true,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93796_04_05',
            'dossier sample cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: 'US Economy Analysis',
            fromChannel: true,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93796_04_06',
            'dossier customized cover image',
            { tolerance: 10 }
        );
    });

    it('[TC93976_05] Test warning message when share in new chat', async () => {
        await mainTeams.searchUserAndOpenChat('Megan Bowen');
        await messageExtension.selectAppInMessageExtension({ appName: consts.teamsApp, fromChannel: false });
        await modalDialog.waitForObjectLoadingInMessageExtension();
        await since('1 Warning should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getWarningTextForNewChat())
            .toBe(consts.warningTextForNewChat);
        await modalDialog.chooseDossier(consts.dossier.name);
        await since('2 Share button is disabled should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.isShareButtonDisabled())
            .toBe(true);
        await browser.switchToFrame(null);
        await modalDialog.closeMessageExtensionDialog();
        await mainTeams.createNewChat({ user1: 'demo', user2: 'Megan' });
        await messageExtension.selectAppInMessageExtension({ appName: consts.teamsApp, fromChannel: false });
        await modalDialog.waitForObjectLoadingInMessageExtension();
        await since('3 Warning should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getWarningTextForNewChat())
            .toBe(consts.warningTextForNewChat);
        await modalDialog.chooseDossier(consts.dossier.name);
        await since('4 Share button is disabled should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.isShareButtonDisabled())
            .toBe(true);
        await browser.switchToFrame(null);
        await modalDialog.closeMessageExtensionDialog();
    });
});
