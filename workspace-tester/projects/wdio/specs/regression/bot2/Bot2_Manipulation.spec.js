import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import createBotByAPIV2 from '../../../api/bot2/createBotAPIV2.js';
import * as bot from '../../../constants/bot2.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { updateBotV2StatusByAPI } from '../../../api/bot2/updateBotV2StatusAPI.js';

describe('Bot 2.0 Manipulation', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const bot_folder = {
        name: 'Target Folder',
        path: ['Shared Reports', 'Bot2.0', 'Automation', 'iOS'],
    };
    const user_access = {
        username: 'bot2_auto',
        password: '',
    };
    const senderUser = {
        credentials: {
            username: 'Auto_ShareBot_Sender',
            password: '',
        },
        id: 'CDA73A2E4C02ADC1AF40CC9BAE9D3020',
        firstName: 'Sender',
        fullName: 'Sender for share bot',
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const botName = 'Airline Bot';
    const botId = 'F756EE1D830643C987EB0CD569A31F6C';
    const titleBarBotName = 'New Bot';

    let {
        loginPage,
        libraryPage,
        sidebar,
        contentDiscovery,
        shareDossier,
        infoWindow,
        listView,
        notification,
        embedBotDialog,
        dossierPage,
        botAuthoring,
        manageAccess,
        quickSearch,
        fullSearch,
        filterOnSearch,
        libraryFilter,
        libraryAuthoringPage,
        aibotChatPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(bot.adcUser.credentials);
        await libraryPage.waitForLibraryLoading();
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await listView.deselectListViewMode();
    });
    afterAll(async () => {
        const credentials = bot.adcUser.credentials;
        const isActive = true;
        const projectId = project.id;
        await updateBotV2StatusByAPI({ credentials, projectId, botId, isActive });
    });
    it('[TC99004_1] Bot Info Window', async () => {
        // Bot info window from library
        await libraryPage.openDefaultApp();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossierInfoWindow(botName);
        await since('Open info window, action buttons count should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(7);
        await since('Open info window, related content present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC99004_1', 'gridView_infoWindow');
        await takeScreenshotByElement(infoWindow.getInfoWindowObjectTypeIcon(), 'TC99004_1', 'gridView_typeIcon');
        await infoWindow.close();

        // Bot info window from search
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('bot');
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(botName);
        await since(
            'Open info window on full search, action buttons count should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(7);
        await since(
            'Open info window on full search, related content present should be #{expected}, while we get #{actual}'
        )
            .expect(await infoWindow.isRelatedContentTitlePresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC99004_1', 'searchResult_infoWindow');
        await takeScreenshotByElement(infoWindow.getInfoWindowObjectTypeIcon(), 'TC99004_1', 'searchResult_typeIcon');
        await infoWindow.close();
        await fullSearch.backToLibrary();

        // Bot info window from content discovery
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(bot_folder.path);
        await listView.openInfoWindowFromListView(botName);
        await since('Open info window, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowActionCount())
            .toBe(7);
        await takeScreenshotByElement(listView.getItemShare(), 'Bot_Manipulation', 'contentDiscovery_infoWindow', {
            tolerance: 0.12,
        });
        // More
        await listView.clickMoreMenuFromIW();
        await since('Open info window, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await listView.getInfoWindowMorActionAcount())
            .toBe(4);
        await takeScreenshotByElement(
            listView.getMoreOptiobDropDownInIW(),
            'TC99004_1',
            'contentDiscovery_infoWindow_more'
        );
    });
    it('[TC99004_2] Share Bot from info window', async () => {
        const inviteContent = `${senderUser.fullName} shared ${botName} with you.`;
        const inviteMessage = 'Share Bot 2.0 from info window.';
        await libraryPage.openDossierContextMenu(botName);
        await libraryPage.hoverOnShare();
        await takeScreenshotByElement(
            await libraryPage.getDossierContextMenu(),
            'Bot_Manipulation',
            'Context Menu Items',
            { tolerance: 0.1 }
        );
        await libraryPage.clickDossierContextMenuItem('Share', 'Share Agent');
        await since(
            'Open share agent dialog from info window, the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Agent');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'Bot_Manipulation',
            'Share agent: cover image from info window',
            { tolerance: 0.1 }
        );
        await shareDossier.searchRecipient(user_access.username);
        await shareDossier.selectRecipients([user_access.username]);
        await shareDossier.addMessage(inviteMessage);
        await shareDossier.shareDossier();
        await shareDossier.sleep(3000); // Wait for the email to be sent
        await dossierPage.goToLibrary();

        // Recipient receives a new notification
        // await notification.openPanel();
        // await since('Invite content in notification should be "#{expected}", instead we have "#{actual}"')
        //     .expect(await notification.getNotificationMsgByIndex(0).getText())
        //     .toEqual(inviteContent);
        // await since('Invite message in notification should be "#{expected}", instead we have "#{actual}"')
        //     .expect(await notification.getSharedMessageText(0))
        //     .toEqual(inviteMessage);
        // await notification.closePanel();

        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.searchProject('tutorial');
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath(bot_folder.path);
        await listView.openInfoWindowFromListView(botName);
        await listView.clickShareFromIW();
        await since(
            'Open share bot dialog from Content Discovery (bot in library), the title of share dialog should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await shareDossier.getShareDialogTitle())
            .toEqual('Share Agent');
        await takeScreenshotByElement(
            await shareDossier.getDossierCoverImage(),
            'Bot_Manipulation',
            'Share bot: cover image from Content Discovery (bot in library)',
            { tolerance: 0.1 }
        );
        await shareDossier.closeDialog();
    });
    it('[TC99004_3] Embed Bot from info window', async () => {
        await listView.selectListViewMode();
        await listView.openInfoWindowFromListView(botName);
        await listView.clickEmbedBotFromIW();
        await takeScreenshotByElement(
            embedBotDialog.getEmbedBotDialogContainer(),
            'Bot_Manipulation',
            'Bot Embed Hide Dropdown',
            { tolerance: 0.1 }
        );
        await embedBotDialog.downloadEmbedBotSnippet();
    });
    it('[TC99004_4] Inactive & active bot', async () => {
        const inactiveBotName = botName + ' (Inactive)';
        await libraryPage.openDossierInfoWindow(botName);
        await since('Active bot, active status should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isBotActive())
            .toBe(true);
        await infoWindow.inactiveBot();
        await libraryPage.sleep(1000); // wait for the bot to be inactive
        await infoWindow.close();
        await libraryPage.openDossierNoWait(botName);
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await since(
            'Run inactive agent from library home, the error message should be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await dossierPage.errorMsg())
            .toEqual('This agent is currently inactive.');
        await libraryPage.dismissError();
        await libraryPage.openDossierInfoWindow(botName);
        await infoWindow.activeBot();
        await libraryPage.sleep(5000);
        await since('Active agent, active status should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isBotActive())
            .toBe(true);
        await infoWindow.close();
        await libraryPage.openDossier(botName);
        await dossierPage.waitForDossierLoading();
        await since('Bot name on title bar should be "#{expected}", instead we have "#{actual}"')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toEqual(titleBarBotName);
    });
    it('[TC99004_5] Edit bot', async () => {
        await libraryPage.openDossierInfoWindow(botName);
        await infoWindow.clickEditButton();
        await botAuthoring.waitForPageLoading();
        await botAuthoring.selectBotConfigTabByName('custom-instruction');
    });
    it('[TC99004_6] Manage access on bot', async () => {
        await libraryPage.openDossierInfoWindow(botName);
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since('open manage access, manage access window present should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.isManageAccessPresent())
            .toBe(true);
        // clear dirty data
        const isExisted = await manageAccess.isUserACLExisted(user_access.username);
        if (isExisted) {
            await manageAccess.removeACL(user_access.username);
        }

        await takeScreenshotByElement(manageAccess.getManageAccessDialog(), 'Bot_Manipulation', 'manageAccessWindow');
        const acl_count = await manageAccess.getACLItemscount();

        // add acl
        await manageAccess.addACL([user_access.username], [], 'Can View');
        await since('add acl, acl items count should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.getACLItemscount())
            .toBe(acl_count + 1);

        // delete acl
        await manageAccess.removeACL(user_access.username);
        await since('delete acl, acl items count should be #{expected}, while we get #{actual}')
            .expect(await manageAccess.getACLItemscount())
            .toBe(acl_count);

        await manageAccess.cancelManageAccessChange();
        await infoWindow.close();
    });
    it('[TC99004_7] Filter bot in library and search', async () => {
        // Library page
        const libraryCount = await libraryPage.getAllCountFromTitle();
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterTypeDropdown();
        await since('Filter panel Bot present should be #{expected}, while we get #{actual}')
            .expect(await libraryFilter.isFilterTypeItemPresent('Bot'))
            .toBe(true);
        await since('Filter panel Agent present should be #{expected}, while we get #{actual}')
            .expect(await libraryFilter.isFilterTypeItemPresent('Agent'))
            .toBe(true);
        await takeScreenshotByElement(libraryFilter.getFilterDetailsPanel(), 'TC99004_7', 'Filter on library');
        await libraryFilter.checkFilterType('Agent');
        await libraryFilter.clickApplyButton();
        const filteredLibraryCount = await libraryPage.getAllCountFromTitle();
        await since(
            'Filter on library, no filter results count minus filter results count should be #{expected}, while we get #{actual}'
        )
            .expect(libraryCount - filteredLibraryCount)
            .toBeGreaterThan(0);

        // Search results page - my library tab
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('auto');
        await fullSearch.waitForSearchLoading();
        await fullSearch.clickMyLibraryTab();
        const noFilterMyLibraryCount = await fullSearch.getMyLibraryCount();
        const noFilterResultsCount = await fullSearch.getAllTabCount();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await since('Search results and Filter panel Agent present should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.isOptionPresentInCheckboxPanel('Agent'))
            .toBe(true);
        await filterOnSearch.selectOptionInCheckbox('Agent');
        await filterOnSearch.applyFilterChanged();
        const filterMyLibraryCount = await fullSearch.getMyLibraryCount();
        await since(
            'Filter on search, no filter results count minus filter results count should be #{expected}, while we get #{actual}'
        )
            .expect(noFilterMyLibraryCount - filterMyLibraryCount)
            .toBeGreaterThan(0);

        // Search results page - all tab
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        const filterResultsCount = await fullSearch.getAllTabCount();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await since(
            'Open info window on library search, Agent type exist should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.isOptionPresentInCheckboxPanel('Agent'))
            .toBe(true);

        // Check Agent filter results count
        await filterOnSearch.closeFilterPanel();
        await since(
            'Filter on search, no filter results count minus filter results count should be #{expected}, while we get #{actual}'
        )
            .expect(noFilterResultsCount - filterResultsCount)
            .toBeGreaterThan(0);
    });
});
