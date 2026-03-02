import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as consts from '../../../constants/teams.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, editBotAPI, publishBotByAPI } from '../../../api/bot/index.js';
import { getBotObjectToCreate, getBotObjectToEdit } from '../../../constants/bot.js';
import deleteBotList from '../../../api/bot/deleteBot.js';
import * as post from '../../../constants/customApp/customAppCustomizedEmail.js';
import editLibraryEmbedding from '../../../api/admin/libraryEmbedding.js';
import { randomString, getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteCustomAppByNames from '../../../api/customApp/deleteCustomAppByNames.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';

describe('message extension_open in web', () => {
    let {
        libraryPage,
        loginPage,
        dossierPage,
        modalDialog,
        aibotChatPanel,
        mainTeams,
        messageExtension,
        conversation,
        apps,
    } = browsers.pageObj1;

    let botNotInLibrary = 'F40482_BotNotInLibrary2',
        botNotInLibraryId,
        botNotInLibraryAsHomeAppName = 'Micro_BotAsHome',
        customAppIdOfBotNotInLibrary,
        botInLibrary = 'F40482_Bot2',
        botInLibraryId,
        channel = 'MessageExtensionOpenInWeb',
        group = 'Auto_Group2',
        receipient = 'dossierReceipient',
        contentGroup = 'contentGroupWeb_loooooooooongName' + randomString(4),
        contentGroupId,
        libraryAsHomeAppId,
        libraryAsHomeAppWithContentGroup = 'Micro_LibraryAsHome2';

    beforeAll(async () => {
        browser.options.baseUrl = browsers.params.standardUrl;
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.security });
        await editLibraryEmbedding({ credentials: consts.mstrUser.credentials, embeddingInfo: post.all_security });
        // 0. delete existing custom app and content group
        await deleteCustomAppByNames({
            credentials: consts.mstrUser.credentials,
            namesToFind: ['Micro_BotAsHome', 'Micro_LibraryAsHome2'],
            exactMatch: false,
        });
        await deleteContentGroupsByNames({
            credentials: consts.mstrUser.credentials,
            namesToFind: ['contentGroupWeb_loooooooooongName'],
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
        let botNotInLibraryBody = getBotObjectToCreate({ botName: botNotInLibrary, folderId: consts.folderId });
        botNotInLibraryId = await createBotByAPI({
            credentials: consts.mstrUser.credentials,
            botInfo: botNotInLibraryBody,
        });
        // modify, use OOTB cover image
        const botObjToEdit = getBotObjectToEdit({ id: botNotInLibraryId, folderId: consts.folderId });
        botObjToEdit.configuration.general.coverImageUrl = 'ai-industry/Sports.jpg';
        await editBotAPI({ credentials: consts.mstrUser.credentials, botInfo: botObjToEdit });
        // create bot as home app
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
        // 3. create content group: 'F40482_Bot1', 'US Economy Analysis', receipient is bot
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
        // 4. create library as home app
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
        await apps.openTeamsApp(consts.teamsApp);
    });

    beforeEach(async () => {
        await dossierPage.switchToTab(0);
        await mainTeams.switchToAppInSidebar('Teams');
        await mainTeams.waitForTeamsView();
    });

    afterEach(async () => {
        const tabs = (await dossierPage.getBrowserTabs()).length;
        if (tabs > 1) {
            await dossierPage.closeTab(1);
        }
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
            customAppIdList: [customAppIdOfBotNotInLibrary, libraryAsHomeAppId],
        });
        await deleteContentGroupsByIds({ credentials: consts.mstrUser.credentials, contentGroupIds: [contentGroupId] });
        await deleteBotList({
            credentials: consts.mstrUser.credentials,
            botList: [botNotInLibraryId, botInLibraryId],
        });
    });

    it('[TC93975_01] Share bot in group', async () => {
        // 1. bot not in library, bot as home app
        await mainTeams.switchToChat(group);
        await messageExtension.shareObjectFromMessageExtension({
            application: botNotInLibraryAsHomeAppName,
            object: botNotInLibrary,
        });
        await conversation.openLatestObjectFromMessageExtensionInWeb();
        await dossierPage.switchToTab(1);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        if (await loginPage.getUsernameForm().isDisplayed()) {
            await loginPage.login(consts.receipient.credentials);
            await dossierPage.waitForDossierLoading();
        }
        await aibotChatPanel.askQuestion(consts.question);
        await since('1 Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('2 Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(true);
        await since('3 Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        // assert custom app is selected
        await since('The url should contain app id #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .toContain(customAppIdOfBotNotInLibrary);
        await dossierPage.closeTab(1);
        // 2.bot in library, default app
        await mainTeams.switchToChat(group);
        await messageExtension.shareObjectFromMessageExtension({
            object: botInLibrary,
        });
        await conversation.openLatestObjectFromMessageExtensionInWeb();
        await dossierPage.switchToTab(1);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        // assert default app is selected
        await since('The url should not contain #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .not.toContain('config');
        await dossierPage.closeTab(1);
    });

    it('[TC93975_02] Share dashboard in channel', async () => {
        // dossier not in library, default app
        await mainTeams.switchToTeamsChannel({ team: consts.teamChannel, channel });
        await messageExtension.shareObjectFromMessageExtension({
            object: consts.dossierNotInLibrary.name,
            fromChannel: true,
        });
        await conversation.openLatestObjectFromMessageExtensionInWeb();
        await dossierPage.switchToTab(1);
        await libraryPage.waitForItemLoading();
        await dossierPage.waitForDossierLoading();
        if (await loginPage.getUsernameForm().isDisplayed()) {
            await loginPage.login(consts.receipient.credentials);
            await dossierPage.waitForDossierLoading();
        }
        await since('1 Existence of Add to library should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await since('2 Existence of edit icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isEditIconPresent())
            .toBe(true);
        await since('3 Existence of account icon should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAccountIconPresent())
            .toBe(true);
        // assert default app is selected
        await since('The url should not contain #{expected}, instead we have #{actual}')
            .expect(await browser.getUrl())
            .not.toContain('config');
        await dossierPage.closeTab(1);
    });

    it('[TC93975_03] Test UI of share object from message extenstion in channel', async () => {
        await mainTeams.switchToTeamsChannel({ team: consts.teamChannel, channel });
        // bot as home app, bot not in library
        await messageExtension.selectAppInMessageExtension({ appName: consts.teamsApp, fromChannel: true });
        await modalDialog.waitForObjectLoadingInMessageExtension();
        await mainTeams.waitForElementVisible(modalDialog.getDialogHeader());
        // inactive bot
        await modalDialog.chooseDossier('Inactive Bot');
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
        await since('4 Existence of F40482_Bot2 should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getDossier('F40482_Bot2').isDisplayed())
            .toBe(true);
        // switch to bot as home app, no content group, type or search
        await modalDialog.switchToApp(botNotInLibraryAsHomeAppName);
        await since('5 Existence of content group should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getContentGroupDropdownList().isDisplayed())
            .toBe(false);
        await since('6 Existence of type should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getTypeDropdownList().isDisplayed())
            .toBe(false);
        await since('7 Existence of search icon should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getSearchIcon().isDisplayed())
            .toBe(false);
        await since('8 Count should be #{expected}, instead we have #{actual}')
            .expect(await modalDialog.getObjectCount())
            .toBe('All (1)');
    });

    it('[TC93975_04] Cover image in shared card, chat', async () => {
        await mainTeams.switchToChat(receipient);
        await messageExtension.shareObjectFromMessageExtension({
            object: botInLibrary,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93795_04_01',
            'bot default cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            application: botNotInLibraryAsHomeAppName,
            object: botNotInLibrary,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93795_04_02',
            'bot OOTB cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: consts.cubeNotPublishedBot.name,
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93795_04_03',
            'bot customized cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: 'F40341_Dossier',
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93795_04_04',
            'dossier default cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: 'Investment Firm Dossier',
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93795_04_05',
            'dossier sample cover image',
            { tolerance: 10 }
        );
        await messageExtension.shareObjectFromMessageExtension({
            object: 'US Economy Analysis',
        });
        await takeScreenshotByElement(
            conversation.getCoverImageInLatestMessageExtensionCard(),
            'TC93795_04_06',
            'dossier customized cover image',
            { tolerance: 10 }
        );
    });

    it('[TC93975_05] Test warning message when share in new chat', async () => {
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
